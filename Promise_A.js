/**
 * Promise/Deferred模式
 * Promise/A提议对单个异步操作做出了这样的抽象定义，具体如下所示：
 * 1.Promise操作只会处在3中状态的一种：未完成态、完成态和失败态。
 * 2.Promise的状态只会出现从未完成态向完成态或者失败态转化，不能逆反。完成态和失败态不能相互转化。
 * 3.Promise的状态一旦转化，将不能被更改。
 * 
 * 再API的定义上，Promise/A提议是比较简单的。一个Promise对象只要具备then()方法即可。但是对于then()方法，有以下简单的要求。
 * 1.接受完成态、错误态的回调方法。再操作完成或者出现错误时，将会调用对应方法。
 * 2.可选地支持progress事件回调作为第三个方法。
 * 3.then()方法只接受function对象，其余对象将被忽略。
 * 4.then()方法继续返回Promise对象，以实现链式调用。
 */



const EventEmitter = require('events')
const util = require('util');

var Promise = function(){
    EventEmitter.call(this)
}
util.inherits(Promise,EventEmitter)

Promise.prototype.then = function(fulfilledHandler,errorHandler,progressHandler){
    if(typeof fulfilledHandler === 'function'){
        this.once('success',fulfilledHandler)
    }
    if(typeof errorHandler === 'function'){
        this.once('error',errorHandler)
    }
    if(typeof progressHandler === 'function'){
        this.once('error',progressHandler)
    }
    return this
}

/**
 * 这里看到then()方法所做的事情是将回调函数存放起来。为了完成整个流程，还需要触发执行这些回调函数的地方，实现这些功能的对象
 * 通常被称为Deferred，即延迟对象，示例代码如下
 */

 var Deferred = function(){
     this.state = 'unfulfilled'
     this.Promise = new Promise
 }

 Deferred.prototype.resolve = function(obj){
    this.state = 'fulfilled'
    this.Promise.emit('success',obj)

 }

 Deferred.prototype.reject = function(obj){
    this.state = 'failed'
    this.Promise.emit('error',obj)
 }

 Deferred.prototype.progress = function(data){
    this.Promise.emit('progress',data)
 }

