var app = angular.module('food10', []);

app.controller('products', ($scope, $http) => {
    const base = 'https://food10-api.herokuapp.com/';
    const products = base + 'products';

    const init = () => {
        $http.get(products).then(res => {
            $scope.products = res.data;
        });
    };

    (() => {
        init();
    })();

    $scope.createProduct = () => {
        $http.post(products, $scope.product).then(res => {
            $scope.products.push(res.data);
            delete $scope.product;
        });
    };

    $scope.apagarProdutos = () => {
        $scope.products.forEach(product => {
            if(product.selected) {
                $http.delete(products.concat('/', product.id)).then(res => $scope.products = $scope.products.filter(p => p.id != product.id));
            }
        });
    };
});

app.controller('basket', ($scope, $http) => {
    const base = 'https://food10-api.herokuapp.com/';
    const products = base + 'products';
    const baskets = base + 'baskets';

    const init = () => {
        $http.get(products).then(res => {
            $scope.products = res.data;
        });
    };

    (() => {
        init();
    })();

    $scope.createBasket = () => {
        $scope.basket.products = $scope.products
                                    .filter(product => product.selected)
                                    .map(product => product.id);
                                    
        $http.post(baskets, $scope.basket).then(res => {
            console.log(res);
        });
    };
});