const fetchData = () => {
    console.log('I am used');
    return Promise.resolve({ title: 'delectus aut autem' });
};

exports.fetchData = fetchData;
