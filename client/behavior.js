import axios from 'axios'
import Device from './device'
var WEB_MONITOR_ID = "v1" // 所属项目ID, 用于替换成相应项目的UUID，生成监控代码的时候搜索替换
var behaviors = [];
var final = [0];
/**
 * 用户访问记录监控
 * @param project 项目详情
 */
export function checkUrlChange(path, apikey) {
        // behaviors = [];
        // recordPV(path, apikey);
        ajax(apikey)
}

// 性能上报
async function recordPerformance(path, apikey){

    /*
    *   DNS查询耗时 ：domainLookupEnd - domainLookupStart
        TCP链接耗时 ：connectEnd - connectStart
        request请求耗时 ：responseEnd - responseStart
        解析dom树耗时 ： domComplete - domInteractive
        白屏时间 ：responseStart - navigationStart
        domready时间(用户可操作时间节点) ：domContentLoadedEventEnd - navigationStart
        onload时间(总下载时间) ：loadEventEnd - navigationStart
    * */
    var arr = [];
    var timing = performance.timing;
    var redirectTiming = timing.redirectEnd - timing.redirectStart
    var domainTiming = timing.domainLookupEnd - timing.domainLookupStart;
    var connectTiming = timing.connectEnd - timing.connectStart;
    var responseTiming = timing.responseEnd - timing.responseStart;
    var domTiming = timing.domComplete - timing.domInteractive;
    var whiteTiming = timing.responseStart - timing.navigationStart;
    var domContentTiming = timing.domContentLoadedEventEnd  - timing.navigationStart;
    var loadTiming = timing.loadEventEnd  - timing.navigationStart;
    if('performance' in window) {
        // 获取的是所有的PerformanceResourceTiming
        var index = final[final.length - 1] == 0 ? 0 : final[final.length - 1]-1
        var resources = window.performance.getEntriesByType('resource').slice(index)
        final.push(window.performance.getEntriesByType('resource').length)
        // 遍历各个资源加载的时间
        resources.map(async (resource) => {
            arr.push({
                name:resource.name,
                duration :parseInt(resource.duration),
                initiatorType :resource.initiatorType,
                pageUrl: path,
                transferSize: resource.transferSize
            })

            // 慢性能上报
            if(resource.duration > 5000) {
                let res = await axios.post('http://39.106.10.163:7001/admin/slowPerformance',{
                    name:resource.name,
                    duration :parseInt(resource.duration),
                    initiatorType :resource.initiatorType,
                    pageUrl: path,
                    transferSize: resource.transferSize,
                    apikey:apikey
                }).catch(err => null);
            }
        })
        await axios.post('http://39.106.10.163:7001/admin/performance',{
            resourses:arr,
            pageUrl: path,
            redirectTiming,
            domainTiming,
            connectTiming,
            responseTiming,
            domTiming,
            whiteTiming,
            domContentTiming,
            loadTiming,
            deviceType : Device.getDeviceInfo().deviceType,
            os : Device.getDeviceInfo().OS,
            browserInfo : Device.getDeviceInfo().browserInfo,
            OSVersion : Device.getDeviceInfo().OSVersion,
            apikey:apikey
        }).catch(() => null);
    }
}

/**
 * 用户访问记录监控
 * @param project 项目详情
 */
export async function recordPV(path, apikey) {

    behaviors = [];
    behaviors.push({
        HTTP_LOG:'page_load',
        type:'load',
        url:'',
        status:'',
        statusText:'',
        msg:"页面加载",
        currentTime:new Date().getTime(),
        innerText:'',
        className:'',
        inputValue:'',
        tagName:'',
        placeHolder:'',
        pageUrl:path,
        deviceType : Device.getDeviceInfo().deviceType,
        os : Device.getDeviceInfo().OS,
        browserInfo : Device.getDeviceInfo().browserInfo,
        OSVersion : Device.getDeviceInfo().OSVersion,
        stack:'',
        componentName: '',
        propsData: '',
        info: ''
    })

    await axios.post('http://39.106.10.163:7001/admin/load',{
        url:'',
        pageUrl:path,
        deviceType : Device.getDeviceInfo().deviceType,
        os : Device.getDeviceInfo().OS,
        browserInfo : Device.getDeviceInfo().browserInfo,
        OSVersion : Device.getDeviceInfo().OSVersion,
        currentTime:new Date().getTime(),
        status,
        statusText:'页面加载',
        type:'page_load',
        componentName:'',
        stack:'',
        propsData:'',
        apikey:apikey
    }).catch(()=>null);

    // 性能上报
    recordPerformance(path, apikey);

    return behaviors;
}


// /**
//  * 页面JS错误监控
//  */
// export function recordJavaScriptError() {
//     console.log(8123881723)
//     // 重写console.error, 可以捕获更全面的报错信息
//     var oldError = console.error;
//     console.error = function (tempErrorMsg) {
//         console.log(82137878123781278378128737812738)
//         console.log(tempErrorMsg)
//         var errorMsg = (arguments[0] && arguments[0].message) || tempErrorMsg;
//         var lineNumber = 0;
//         var columnNumber = 0;
//         var errorObj = arguments[0] && arguments[0].stack;
//         console.log(errorObj)
//         if (!errorObj) {
//             if (typeof errorMsg == "object") {
//                 try {
//                     errorMsg = JSON.stringify(errorMsg)
//                 } catch(e) {
//                     errorMsg = "错误无法解析"
//                 }
//             }
//             // siftAndMakeUpMessage("console_error", errorMsg, WEB_LOCATION, lineNumber, columnNumber, "CustomizeError: " + errorMsg);
//         } else {
//             // 如果报错中包含错误堆栈，可以认为是JS报错，而非自定义报错
//             // siftAndMakeUpMessage("on_error", errorMsg, WEB_LOCATION, lineNumber, columnNumber, errorObj);
//         }
//         return oldError.apply(console, arguments);
//     };
//     // 重写 onerror 进行jsError的监听
//     window.addEventListener('error', function(errorMsg, url, lineNumber, columnNumber, errorObj) {
//         console.log('qwuieiuqwueiuiqwuieuiqweuei')
//         // jsMonitorStarted = true;
//         var errorStack = errorObj ? errorObj.stack : null;
//         console.log(errorStack)
//         // siftAndMakeUpMessage("on_error", errorMsg, url, lineNumber, columnNumber, errorStack);
//     });
//     window.onunhandledrejection = function(e) {
//         var errorMsg = "";
//         var errorStack = "";
//         if (typeof e.reason === "object") {
//             errorMsg = e.reason.message;
//             errorStack = e.reason.stack;
//         } else {
//             errorMsg = e.reason;
//             errorStack = "";
//         }
//         // siftAndMakeUpMessage("on_error", errorMsg, WEB_LOCATION, 0, 0, "UncaughtInPromiseError: " + errorStack);
//     }
// }
// recordJavaScriptError()


/**
 * 用户行为记录监控
 * @param project 项目详情
 */
export function recordBehaviorClick(apikey, getBehaviorsState) {
        document.addEventListener('click', (e) =>{
            var className = "";
            var placeholder = "";
            var inputValue = "";
            var tagName = e.target.tagName;
            var innerText = "";
            if (e.target.tagName != "svg" && e.target.tagName != "use") {
                className = e.target.className;
                placeholder = e.target.placeholder || "";
                inputValue = e.target.value || "";
                innerText = e.target.innerText.replace(/\s*/g, "");
                // 如果点击的内容过长，就截取上传
                if (innerText.length > 200) innerText = innerText.substring(0, 100) + "... ..." + innerText.substring(innerText.length - 99, innerText.length - 1);
                innerText = innerText.replace(/\s/g, '');
            }
            //new BehaviorInfo('ELE_BEHAVIOR', "click", className, placeholder, inputValue, tagName, innerText);

            behaviors.push(
                {
                    HTTP_LOG:'click_log',
                    type:'click',
                    url:'',
                    status:'',
                    statusText:'',
                    msg:"点击事件",
                    currentTime:new Date().getTime(),
                    innerText:innerText,
                    className:className,
                    inputValue:inputValue,
                    tagName:tagName.toLowerCase(),
                    placeHolder:placeholder,
                    stack:'',
                    componentName: '',
                    propsData: '',
                    info: ''
                }
            )
            // ajax(apikey)
            console.log(behaviors)
        }, true)
        return behaviors;
}


/**
 * 页面接口请求监控
 */

export async function ajax(apikey){
    function ajaxEventTrigger(event) {
        var ajaxEvent = new CustomEvent(event, {
            detail: this
        });
        window.dispatchEvent(ajaxEvent);
    }
    var oldXHR = window.XMLHttpRequest;

    function newXHR() {
        var realXHR = new oldXHR();
        realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
        realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
        realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
        realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
        realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
        realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
        realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
        realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
        return realXHR;
    }

    window.XMLHttpRequest = newXHR;

    window.addEventListener('ajaxLoadEnd', async function(e) {
        var currentTime = new Date().getTime()
        var url = e.detail.responseURL;
        var status = e.detail.status;
        var statusText = e.detail.statusText;
        // if (!url || url.indexOf(HTTP_UPLOAD_LOG_API) != -1) return;
        // new HttpLogInfo('HTTP_LOG', url, status, statusText, "请求返回", currentTime);
        //httpLogInfo.handleLogInfo('HTTP_ERROR', httpLogInfo);

        if(url.indexOf('/admin/') == -1){
            if(status!=200){
                behaviors.push(
                    {
                        HTTP_LOG:'ajax_log',
                        type:'ajax',
                        url,
                        status,
                        statusText,
                        msg:"请求失败",
                        currentTime,
                        innerText:'',
                        className:'',
                        inputValue:'',
                        tagName:'',
                        placeHolder:'',
                        pageUrl:window.location.href.split('?')[0].replace('#', ''),
                        deviceType : Device.getDeviceInfo().deviceType,
                        os : Device.getDeviceInfo().OS,
                        browserInfo : Device.getDeviceInfo().browserInfo,
                        OSVersion : Device.getDeviceInfo().OSVersion,
                        stack:'',
                        componentName: '',
                        propsData: '',
                        info: ''
                    }
                )
            }
            else{
                behaviors.push(
                    {
                        HTTP_LOG:'ajax_log',
                        type:'ajax',
                        url,
                        status,
                        statusText,
                        msg:"请求成功",
                        currentTime,
                        innerText:'',
                        className:'',
                        inputValue:'',
                        tagName:'',
                        placeHolder:'',
                        pageUrl:window.location.href.split('?')[0].replace('#', ''),
                        deviceType : Device.getDeviceInfo().deviceType,
                        os : Device.getDeviceInfo().OS,
                        browserInfo : Device.getDeviceInfo().browserInfo,
                        OSVersion : Device.getDeviceInfo().OSVersion,
                        stack:'',
                        componentName: '',
                        propsData: '',
                        info: ''
                    }
                )
            }

            console.log(status)

            if(status != 200 && url!= '' && url.indexOf('/admin/') == -1){
                await axios.post('http://39.106.10.163:7001/admin/add',{
                    url,
                    pageUrl:window.location.href.split('?')[0].replace('#', ''),
                    deviceType : Device.getDeviceInfo().deviceType,
                    os : Device.getDeviceInfo().OS,
                    browserInfo : Device.getDeviceInfo().browserInfo,
                    OSVersion : Device.getDeviceInfo().OSVersion,
                    currentTime,
                    status,
                    statusText,
                    behaviors:JSON.stringify(behaviors),
                    apikey:apikey
                }).catch(()=>null);
                console.log('ajax1')
                await axios.post('http://39.106.10.163:7001/admin/error',{
                    url,
                    pageUrl:window.location.href.split('?')[0].replace('#', ''),
                    deviceType : Device.getDeviceInfo().deviceType,
                    os : Device.getDeviceInfo().OS,
                    browserInfo : Device.getDeviceInfo().browserInfo,
                    OSVersion : Device.getDeviceInfo().OSVersion,
                    currentTime,
                    status,
                    statusText,
                    type:'ajax_error',
                    componentName:'',
                    stack:'',
                    propsData:'',
                    apikey:apikey
                }).catch(()=>null);
                // behaviors = [];
            }
        }

    })
}



export function getBehaviors() {
    console.log(behaviors)
    return behaviors;
}
