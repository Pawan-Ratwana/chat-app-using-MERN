const mongoose = require('mongoose');

const url = 'mongodb+srv://pawan:admin1234@cluster0.uwoir1o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to mongoDB')).catch((e) => console.log('Error', e))