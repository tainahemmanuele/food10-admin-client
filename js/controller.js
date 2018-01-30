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
            console.log(res.data);
            $scope.products.push(res.data);
            delete $scope.product;
        });
    };
});