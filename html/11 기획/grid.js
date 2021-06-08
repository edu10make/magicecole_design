import Grid from 'tui-grid';

import 'tui-grid/dist/tui-grid.css';

const options = {
    el: document.getElementById('grid'),
    columns: [{
            header: 'Name',
            name: 'name'
        },
        {
            header: 'Artist',
            name: 'artist'
        },
        {
            header: 'Price',
            name: 'price'
        },
        {
            header: 'Genre',
            name: 'genre'
        }
    ],
    data: [{
        name: 'Beautiful Lies',
        artist: 'Birdy',
        price: 10000,
        genre: 'Pop'
    }]
};

const grid = new Grid(options); // 그리드 인스턴스 생성

