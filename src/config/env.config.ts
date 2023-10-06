export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'development',
  mongodb: process.env.MONGO_DB,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
});
