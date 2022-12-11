const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client');
const validPassword = require('../lib/passwordUtils').validPassword;

const prisma = new PrismaClient();

const customFields = {
  usernameField: 'uname',
  passwordField: 'pw',
}

const verifyCallback = async (username, password, done) => {
  const user =  await prisma.user.findFirst({
    where:{username: username},
  }).then((user) => {
    if(!user) {
      return done(null, false);
    }

    const isvalid = validPassword(password, user.hash, user.salt);

    if(isvalid) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }).then(async () => {

    await prisma.$disconnect()

  }).catch(async (e) => {

    done(e)

    await prisma.$disconnect()

    process.exit(1)
  });
};

const Strategy = new localStrategy(customFields, verifyCallback);

passport.use(Strategy);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser( async (userId, done) => {
  const user =  await prisma.user.findFirst({
    where:{username: username},
  }).then(user => done(null, user)).then(async () => {

    await prisma.$disconnect()

  }).catch(async (e) => {

    done(e)

    await prisma.$disconnect()

    process.exit(1)
  });
});