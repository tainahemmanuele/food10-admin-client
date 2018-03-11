app.controller('hampers', ($scope, $http) => {
    const base = 'https://food10-api.herokuapp.com/';
    const products = base + 'products';
    const hampers = base + 'hampers';
    const profit = 1;
    $scope.levels = [
        { label: 'Básica', value: 1 },
        { label: 'Média', value: 2 },
        { label: 'Completa', value: 3 }
    ];

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
        $http.post(hampers, $scope.hamper).then(res => {
            $scope.hampers.push(res.data);
            delete $scope.hamper.name;
            delete $scope.hamper.description;
            $scope.hamper.level = $scope.levels[0].value
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