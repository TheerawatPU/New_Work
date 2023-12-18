import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import errorHandler from './middleware/errorHandler';
import fourOhFour from './middleware/fourOhFour';

// import Routes
import userRoutes from './routes/user';
import orderRoutes from './routes/Order';
import OrderDetailRoutes from './routes/OrderDetail';
import productRoutes from './routes/Product';
import ProductCategoryRoutes from './routes/ProductCategory';
import TestmiddlewareRoutes from './routes/TestmiddlewareRoutes';

// login
import loginRoutes from './routes/LoginRoutes';

// sendmail
import sendmailRoutes from './routes/sendmailRoutes';
import verifyOTPRoutes from './routes/VerifyOTPRoutes';

import logoutRoutes from './routes/logoutRoutes';

// uploadfile
import uploadFileRoutes from './routes/UploadFileRoutes';


// Token
// import tokenRoutes from './routes/TokenRoutes';

const app = express();

// Apply most middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        // @ts-ignore
        origin: config.clientOrigins[config.nodeEnv],
    }),
);
app.use(helmet());
app.use(morgan('tiny'));

// Apply routes before error handling

// Routes
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/ProductCategory', ProductCategoryRoutes);
app.use('/order', orderRoutes);
app.use('/OrderDatail', OrderDetailRoutes);

app.use('/Test', TestmiddlewareRoutes);

// login
app.use('/Login', loginRoutes);
app.use('/sendmail', sendmailRoutes);
app.use('/verifyOTPRoutes', verifyOTPRoutes);


// logout
app.use('/logout', logoutRoutes);

// upload files
app.use('/uploadfile', uploadFileRoutes);
// app.use('/', test);

// Apply error handling last
app.use(fourOhFour);
app.use(errorHandler);

export default app;
