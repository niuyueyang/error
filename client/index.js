let axios = require('axios');
import Device from './device'
import {recordBehaviorClick,getBehaviors,checkUrlChange,recordPV,ajax} from './behavior'
var getBehaviorsState = getBehaviors();

//
function formatComponentName(vm) {
    try {
        if (vm.$root === vm) return "root";

        var name = vm._isVue
            ? (vm.$options && vm.$options.name) ||
            (vm.$options && vm.$options._componentTag)
            : vm.name;
        return (
            (name ? "component <" + name + ">" : "anonymous component") +
            (vm._isVue && vm.$options && vm.$options.__file
                ? " at " + (vm.$options && vm.$options.__file)
                : "")
        );
    } catch (error) {
        // 无需出错处理
    }
}

//监控资源加载

export default function(Vue, router, apikey) {

    recordBehaviorClick(apikey)
    ajax(apikey);
    // 获取Promise错误
    function promiseError() {
        window.addEventListener('unhandledrejection', async (event) => {
            try {
                if (!event || !event.reason) {
                    return;
                }
                //判断当前被捕获的异常url，是否是异常处理url，防止死循环
                if (event.reason.config && event.reason.config.url) {
                    this.url = event.reason.config.url;
                }

                let msg = event.reason;
                /*
                        * @desc 用户点击行为监控
                    * */
                // await recordBehaviorClick();


                console.log('promise error')
                await axios.post('http://39.106.10.163:7001/admin/error',{
                    url:'',
                    pageUrl:window.location.href.split('?')[0].replace('#', ''),
                    deviceType : Device.getDeviceInfo().deviceType,
                    os : Device.getDeviceInfo().OS,
                    browserInfo : Device.getDeviceInfo().browserInfo,
                    OSVersion : Device.getDeviceInfo().OSVersion,
                    currentTime: new Date().getTime(),
                    status:'',
                    statusText:msg,
                    type:'promise_error',
                    componentName:'',
                    stack:'',
                    propsData: '',
                    apikey:apikey
                }).catch(()=>null);
            } catch (error) {
                console.log(error);
            }
        }, true);
    }
    promiseError();

    router.afterEach(async (to, from, next) => {
        if(to.path != from.path){
            getBehaviorsState = [];
            var loadData = await recordPV(window.location.protocol+'//'+window.location.host+to.path, apikey);
            getBehaviorsState= getBehaviorsState.concat(loadData)
        }
    })

    Promise.resolve().then( () => {
        // img加载失败监控
        window.addEventListener('error', async (event) => {
            setTimeout(async () => {
                if(!event){
                    return;
                }
                let target = event.target || event.srcElement;
                var isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
                if (!isElementTarget) {
                    return; // js error不再处理
                }
                let msg = "加载 "+target.tagName+" 资源错误";
                let url = target.src || target.href;

                /*            /!*
                                * @desc 用户点击行为监控
                            * *!/
                            await recordBehaviorClick(apikey);*/

                /*
                    * @desc 用户请求行为监控
                * */

                getBehaviorsState.push({
                    HTTP_LOG:'file_log',
                    msg:msg,
                    url: url,
                    type: target.tagName.toLowerCase(),
                    status:404,
                    statusText:'error',
                    currentTime:new Date().getTime(),
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
                })

                // 错误上报
                console.log('js error')
                await axios.post('http://39.106.10.163:7001/admin/error',{
                    url,
                    pageUrl:window.location.href.split('?')[0].replace('#', ''),
                    deviceType : Device.getDeviceInfo().deviceType,
                    os : Device.getDeviceInfo().OS,
                    browserInfo : Device.getDeviceInfo().browserInfo,
                    OSVersion : Device.getDeviceInfo().OSVersion,
                    currentTime: new Date().getTime(),
                    status,
                    statusText:'资源加载失败',
                    type:''+target.tagName.toLowerCase()+'_error',
                    componentName:'',
                    stack:'',
                    propsData:'',
                    apikey:apikey
                }).catch(()=>null);


                if(getBehaviorsState.length != 0){
                    console.log(12653561256312563, getBehaviorsState)
                    await axios.post('http://39.106.10.163:7001/admin/add',{
                        url:'资源加载错误',
                        pageUrl:window.location.href.split('?')[0].replace('#', ''),
                        deviceType : Device.getDeviceInfo().deviceType,
                        os : Device.getDeviceInfo().OS,
                        browserInfo : Device.getDeviceInfo().browserInfo,
                        OSVersion : Device.getDeviceInfo().OSVersion,
                        currentTime: new Date().getTime(),
                        status:404,
                        statusText:'资源加载失败',
                        behaviors:JSON.stringify(getBehaviorsState),
                        apikey:apikey
                    }).catch(()=>null);
                    // getBehaviorsState = []
                    // behaviors = [];
                }
            }, 100)
        },true);
    }).then(() => {
        // js错误监控
        Vue.config.errorHandler = async function(err, vm, info) {
            setTimeout(async () => {
                try {
                    if (vm) {
                        var componentName = formatComponentName(vm);
                        var propsData = vm.$options && vm.$options.propsData;
                        /*
                            * @desc 用户点击行为监控
                        * */

                        /*
                            * @desc 用户请求行为监控
                        * */

                        getBehaviorsState.push({
                            HTTP_LOG:'js_log',
                            msg:err.message,
                            url: '',
                            type: 'js_error',
                            status:'',
                            statusText:'js_error',
                            currentTime:new Date().getTime(),
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
                            stack:err.stack,
                            componentName: componentName,
                            propsData: JSON.stringify(propsData),
                            info: info,
                        })
                        await axios.post('http://39.106.10.163:7001/admin/error',{
                            url:'',
                            pageUrl:window.location.href.split('?')[0].replace('#', ''),
                            deviceType : Device.getDeviceInfo().deviceType,
                            os : Device.getDeviceInfo().OS,
                            browserInfo : Device.getDeviceInfo().browserInfo,
                            OSVersion : Device.getDeviceInfo().OSVersion,
                            currentTime: new Date().getTime(),
                            status:'',
                            statusText:info,
                            type:'js_error',
                            componentName:componentName,
                            stack:err.stack,
                            propsData: typeof (propsData) == 'undefined' ? '' : propsData,
                            apikey:apikey
                        }).catch(()=>null);

                        console.log(getBehaviorsState)

                        if(getBehaviorsState.length != 0){
                            await axios.post('http://39.106.10.163:7001/admin/add',{
                                url:'js错误',
                                pageUrl:window.location.href.split('?')[0].replace('#', ''),
                                deviceType : Device.getDeviceInfo().deviceType,
                                os : Device.getDeviceInfo().OS,
                                browserInfo : Device.getDeviceInfo().browserInfo,
                                OSVersion : Device.getDeviceInfo().OSVersion,
                                currentTime: new Date().getTime(),
                                status:'',
                                statusText:info,
                                behaviors:JSON.stringify(getBehaviorsState),
                                apikey
                            }).catch(()=>null);
                            // getBehaviorsState = []
                        }
                    } else {
                        console.log(err)
                    }
                }
                catch (error) {
                    // 无需出错处理
                }
            }, 200)
        };
    })




}
