const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const methodOverride = require('method-override');
const passport = require ('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require ('connect-mongo');

//const {createAdminUser} = require ('./libs/createUser');
const config = require ('./config');

const indexRoutes = require ('./routes/index.routes');
const notesRoutes = require ('./routes/notes.routes');
const userRoutes = require ('./routes/users.routes');
const providersRoutes = require ('./routes/providers.routes');

//Inicializations
const app = express();
require ('./config/passport');
//createAdminUser();

//Settings
app.set("port", config.PORT);
app.set('views', path.join(__dirname,'views'));

app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs'
}));
app.set('view engine','.hbs');
    
//Middlewares

app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  //store: MongoStore.connect('mongodb: //Informatica2021:Informatica2021@papeleria.sii1x.mongodb.net/papeleria?retryWrites=true&w=majority')
  store: MongoStore.create({ mongoUrl: config.MONGODB_URI }),
})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Global Variables
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//Routes
app.use(indexRoutes);
app.use(userRoutes);
app.use(notesRoutes);
app.use(providersRoutes);

//Static Files
//app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname, 'public/')));

app.use((req, res) => {
  res.render("404");
});

module.exports = app;
