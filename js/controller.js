var app = angular.module('food10', []);

app.controller('products', ($scope, $http) => {
    const base = 'https://food10-api.herokuapp.com/';
    const products = base + 'products';

    const init = () => {
        $http.get(products).then(res => {
            $scope.products = res.data;
        });
        $scope.products = [{"id":44,"name":"Melão","price":17.0,"created_at":"2018-02-25T15:13:56.088Z","updated_at":"2018-02-26T02:16:11.205Z","hamper_id":25},{"id":40,"name":"Jaca","price":13.0,"created_at":"2018-02-24T20:49:43.147Z","updated_at":"2018-02-26T02:16:11.207Z","hamper_id":25},{"id":3,"name":"galinha","price":20.0,"created_at":"2018-01-30T00:46:56.351Z","updated_at":"2018-02-26T17:13:09.422Z","hamper_id":27},{"id":43,"name":"Feijão","price":10.0,"created_at":"2018-02-25T14:49:18.250Z","updated_at":"2018-02-26T17:13:09.475Z","hamper_id":27}];
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
    const profit = 1;

    $scope.hamper = {};

    const init = () => {
        $http.get(products).then(res => {
            $scope.products = res.data;
        });
        $scope.products = [{"id":44,"name":"Melão","price":17.0,"created_at":"2018-02-25T15:13:56.088Z","updated_at":"2018-02-26T02:16:11.205Z","hamper_id":25},{"id":40,"name":"Jaca","price":13.0,"created_at":"2018-02-24T20:49:43.147Z","updated_at":"2018-02-26T02:16:11.207Z","hamper_id":25},{"id":3,"name":"galinha","price":20.0,"created_at":"2018-01-30T00:46:56.351Z","updated_at":"2018-02-26T17:13:09.422Z","hamper_id":27},{"id":43,"name":"Feijão","price":10.0,"created_at":"2018-02-25T14:49:18.250Z","updated_at":"2018-02-26T17:13:09.475Z","hamper_id":27}];

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

    function calculateHamperPrice(hamper) {
        var total = 0;
        hamper.products.forEach(product => {
            total = total + product.price;
        });
        return total;
    };

    $scope.calculateTotalPrice = (hamper) => {
       var valueP = calculateHamperPrice(hamper);
       return valueP + valueP*profit;
    };
});