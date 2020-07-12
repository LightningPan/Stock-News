import tensorflow as tf
import numpy as np
import pandas as pd
import  copy
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import os


def read_process_data(csv='600600.csv', isca=True, look_back=10):
    data = pd.read_csv('stocks/'+csv)
    data = data.drop(['date'], 1)
    data.astype('float32')
    data = data.values
    if isca:
        scaler = MinMaxScaler(feature_range=(-1, 1))
        scaler.fit(data)
        data = scaler.transform(data)
    dataX, dataY = [], []
    for i in range(len(data) - look_back):
        a = data[i:(i + look_back), 1:]
        dataX.append(a)
        dataY.append(data[i:(i + look_back), 0][-1])
    # dataX.shape = (n,look_back,4)
    dataX = np.array(dataX)
    dataY = np.array(dataY)
    dataY.reshape(-1, 1)
    return data




def hidden_layer(layer_input, output_depth, scope):
    input_depth = layer_input.shape[-1]
    with tf.name_scope('hidden'+str(scope)):
        w = tf.get_variable(initializer=tf.random_uniform_initializer(minval=-0.1, maxval=0.1),
                            shape=(input_depth, output_depth),
                            dtype=tf.float32,
                            name='weights'+str(scope))
        b = tf.get_variable(initializer=tf.zeros_initializer(),
                            shape=(output_depth),
                            dtype=tf.float32,
                            name='bias'+str(scope))
        net = tf.matmul(layer_input, w) + b
        tf.summary.histogram('w'+str(scope), w)
        tf.summary.histogram('b'+str(scope), b)
        return net


def dnn(x, output_depths, fncs):
    net = x
    i = 1
    for output_depth, fnc in zip(output_depths, fncs):
        net = hidden_layer(net, output_depth, scope=i)
        net = fnc(net)
        i += 1
    net = hidden_layer(net, 1, scope=0)
    return net


def train_moel(data, neurons, fncs, batch_size=16, epochs=1):
    with tf.name_scope('input_data'):
        X = tf.placeholder(dtype=tf.float32, shape=[None, (data.shape[-1]-1)], name='X')
        Y = tf.placeholder(dtype=tf.float32, shape=[1, 1], name='Y')
    out = dnn(X, neurons, fncs)
    out = tf.identity(out, name='out')
    with tf.name_scope('loss'):
        loss = tf.reduce_mean(tf.squared_difference(out, Y), name='loss')
        tf.summary.scalar('loss', loss)
    with tf.name_scope('opt'):
        opt = tf.train.AdamOptimizer(name='opt').minimize(loss)
    sess = tf.Session()
    merged = tf.summary.merge_all()
    writer = tf.summary.FileWriter("logs/", sess.graph)

    sess.run(tf.global_variables_initializer())
    look_back = 10
    losses =[]
    saver = tf.train.Saver()
    sess.graph.finalize()
    for e in range(epochs):
        for i in range(0, len(data)-look_back):
            sess.run(opt,
                     feed_dict={X: data[i:(i+look_back), 1:],
                                Y: np.array(data[i:(i+look_back), 0][-1])
                                .reshape(1, 1)})
            rs = sess.run(merged,
                          feed_dict={X: data[i:(i+look_back), 1:],
                                     Y: np.array(data[i:(i+look_back), 0][-1])
                                     .reshape(1, 1)})
            writer.add_summary(rs, i)
            if np.mod(i, 50) == 0:
                losses.append(sess.run(loss,
                         feed_dict={X: data[i:(i + look_back), 1:],
                                    Y: np.array(data[i:(i + look_back), 0][-1])
                                    .reshape(1, 1)}))
                print('loss:'+str(losses[-1]))
        y_num = sess.run(out, feed_dict={X: data[:, 1:]})
    saver.save(sess, 'ckpt/stock.ckpt', global_step=epochs)
    sess.close()
    return y_num, losses


def restore_test_model(data):
    graph = tf.Graph()
    with graph.as_default():
        model_file = tf.train.latest_checkpoint('ckpt/')
        saver = tf.train.import_meta_graph(str(model_file) + '.meta')
        with tf.Session() as sess:
            sess.graph.finalize()
            saver.restore(sess, model_file)
            graph = tf.get_default_graph()
            out = graph.get_tensor_by_name("out:0")
            X = graph.get_tensor_by_name("input_data/X:0")
            y_num = sess.run(out, feed_dict={X: data[:, 1:]})
            return y_num


def restore_train_model(data, epochs=1):
    graph = tf.Graph()
    with graph.as_default():
        model_file = tf.train.latest_checkpoint('ckpt/')
        saver = tf.train.import_meta_graph(str(model_file) + '.meta')
        with tf.Session() as sess:
            sess.graph.finalize()
            saver.restore(sess, model_file)
            graph = tf.get_default_graph()
            loss = graph.get_tensor_by_name("loss/loss:0")
            X = graph.get_tensor_by_name("input_data/X:0")
            Y = graph.get_tensor_by_name("input_data/Y:0")
            out = graph.get_tensor_by_name("out:0")
            opt = graph.get_operation_by_name('opt/opt')
            look_back = 10
            losses = []
            for i in range(epochs):
                for i in range(0, len(data) - look_back):
                    sess.run(opt,
                             feed_dict={X: data[i:(i + look_back), 1:],
                                        Y: np.array(data[i:(i + look_back), 0][-1])
                                        .reshape(1, 1)})
                    lossnum = sess.run(loss,
                             feed_dict={X: data[i:(i + look_back), 1:],
                                        Y: np.array(data[i:(i + look_back), 0][-1])
                             .reshape(1, 1)})
                    if np.mod(i, 50) == 0:
                        losses.append(lossnum)
                        print(lossnum)
            saver.save(sess, 'ckpt/stock.ckpt', global_step=epochs+1)
            y_num = sess.run(out, feed_dict={X: data[:, 1:]})
    return y_num, losses


def main():
    data = read_process_data()
    neurons = [1024, 512, 256, 128]
    fncs = [tf.nn.relu, tf.nn.relu, tf.nn.relu, tf.nn.relu]
    y_pred, losses = train_moel(data, neurons, fncs)
    testN()
    pass
def trainN():
    stocklist = [i for i in os.listdir('stocks') if i.endswith('csv') and i.startswith('6')]
    for i in stocklist:
        test_data = read_process_data(csv=i)
        y_pred, losses = restore_train_model(test_data)
        plt.plot(test_data[0:, 0], label='real')
        plt.plot(y_pred, label='pred')
        plt.title(i+'_stock data')
        plt.legend()
        plt.savefig("pred-"+str(i)+".png")
        plt.clf()
        plt.plot(losses, label='loss')
        plt.title(i + 'loss')
        plt.legend()
        plt.savefig("loss-" + str(i)+".png")
        plt.clf()


def testN():
    test_data = read_process_data('000538.csv')
    y_test_pred = restore_test_model(test_data)
    plt.plot(test_data[0:, 0], label='real')
    plt.plot(y_test_pred, label='pred')
    plt.title('000538_stock data')
    plt.legend()
    plt.savefig("test-000538.png")
    plt.clf()

if __name__ == '__main__':
    csv='600599.csv'
    data = pd.read_csv('stocks/' + csv)

    print(type(data))
    #train_moel(data,1,1)
    #trainN()
    #main()
