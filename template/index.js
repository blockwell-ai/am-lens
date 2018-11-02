const handlebars = require("handlebars");
const layouts = require("handlebars-layouts");
const HandlebarsWax = require('handlebars-wax');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

const lensPath = path.resolve(__dirname, "..");
const appPath = process.cwd();

const wax = HandlebarsWax(handlebars)
    .partials([
        `${lensPath}/views/*/**/*.hbs`,
        `!${lensPath}/views/partials/**`
    ])
    .partials(`${lensPath}/views/partials/**.hbs`)
    .helpers(layouts)
    .helpers(require("../views/helpers"));

if (config.get('template_dirs')) {
    config.get('template_dirs').forEach(it => {
        wax
            .partials([
                `${appPath}/${it}/*/**/*.hbs`,
                `!${appPath}/${it}/partials/**`
            ])
            .partials(`${appPath}/${it}/partials/**.hbs`)
    });
}

const cache = {};
let globalData = {};

function setGlobalData(data) {
    globalData = Object.assign(globalData, data);
}

/**
 * Renders a template to the Context body.
 *
 * @param {Application.Context} ctx
 * @param {String} template
 * @param {Object} data
 * @return {Promise<void>}
 */
async function render(ctx, template, data = {}) {
    let t = cache[template];

    if (!t) {
        let templateString;
        if (template.startsWith('lens/')) {
            templateString = await fs.readFile(`${lensPath}/views/${template.slice(5)}.hbs`);
        } else {
            let path;
            // Reverse so that the last ones have priority.
            for (let dir of config.get('template_dirs').reverse()) {
                path = `${appPath}/${dir}/${template}.hbs`;
                try {
                    templateString = await fs.readFile(path);
                    break;
                } catch (e) {
                    // Empty catch, we'll keep trying until we run out of options
                }
            }

            if (!templateString) {
                throw new Error(`No template found for ${template}`);
            }
        }

        t = wax.compile(templateString.toString());
    }

    let baseData = Object.assign({
        user: ctx.state.user
    }, globalData);

    if (ctx.flash) {
        baseData.flash = ctx.flash.get();
    }

    ctx.body = t(Object.assign(baseData, data));
}

async function handlebarsMiddleware(ctx, next) {
    ctx.render = (template, data) => {
        return render(ctx, template, data)
    };
    await next();
}

module.exports = {
    handlebarsMiddleware,
    setGlobalData
};
