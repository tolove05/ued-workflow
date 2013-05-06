/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-5-2
 * Time: 下午6:07
 * To change this template use File | Settings | File Templates.
 */

seajs.config({
    plugins: ['text'],
    alias: {
        template: '/sea-modules/template/template/1.0.0/template'
    },
    preload: ['template']
});