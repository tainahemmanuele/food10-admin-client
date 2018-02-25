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

    $scope.showEditProductForm =  function(data){
        $scope.product = data;
        $scope.editFormVisibility = true;
    };

    $scope.updateProduct = function(product){
        $http.put(products.concat('/', product.id), product).then(res => {
            $scope.products = $scope.products.filter(p => p.id != product.id);
            $scope.products.push(res.data);
            $scope.editFormVisibility = false;
        });
    };
});

app.controller('hampers', ($scope, $http) => {
    const base = 'https://food10-api.herokuapp.com/';
    const products = base + 'products';
    const hampers = base + 'hampers';

    $scope.hamper = {};

    const init = () => {
        $http.get(products).then(res => {
            $scope.products = res.data;
        });
        $http.get(hampers).then(res => {
            $scope.hampers = res.data;
        });
    };

    (() => {
        init();
    })();

    $scope.createHamper = () => {
        $scope.hamper.products = $scope.products
                                    .filter(product => product.selected)
                                    .map(product => product.id);
        
        $http.post(hampers, $scope.hamper).then(res => {
            $scope.hamper.products.forEach(productID => {
                $http.patch(products.concat('/', productID), {'hamper_id': res.data.id})
                    .then(product => {
                        $scope.products = $scope.products.filter(p => p.id != product.data.id);
                        $scope.products.push(product.data);
                    }
                );
            });
        });
                                    
    };

    $scope.deleteHampers = () => {
        $scope.hampers.forEach(hamper => {
            if(hamper.selected) {
                hamper.products.forEach(product => {
                    $http.patch(products.concat('/', product.id), {hamper_id:null}).then(
                        product => {
                            $scope.products = $scope.products.filter(p => p.id != product.data.id);
                            $scope.products.push(product.data);
                        }
                    )
                });
                $http.delete(hampers.concat('/', hamper.id)).then(res => $scope.hampers = $scope.hampers.filter(h => h.id != hamper.id));
            }
        });
    };
});