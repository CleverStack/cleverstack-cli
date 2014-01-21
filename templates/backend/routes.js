module.exports = function( app, {{TemplateName}}Controller, ORM{{TemplateName}}Model, ODM{{TemplateName}}Model ) {
    // Define routes here
    app.all('/{{template_name}}/:action/:id?', {{TemplateName}}Controller.attach());
    app.all('/{{template_name}}/?:action?', {{TemplateName}}Controller.attach());
}