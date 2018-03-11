app.controller('products', ($scope, $http) => {
    const base = 'https://food10-api.herokuapp.com/';
    const products = base + 'products';
    $scope.levels = [
        { label: 'Básica', value: 1 },
        { label: 'Média', value: 2 },
        { label: 'Completa', value: 3 }
    ];

    $scope.vendors = ['Fornecedor 1', 'Fornecedor 2', 'Fornecedor 3'];

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
            delete $scope.product.name;
            delete $scope.product.price;
            delete $scope.product.brand;
            $scope.product.level = $scope.levels[0].value;
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