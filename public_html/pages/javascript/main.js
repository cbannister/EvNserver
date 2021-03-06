/**
 * Created by David on 2017-03-25.
 */
var evnApp = angular.module('evnApp',
    ['ngResource', 'ngMap', 'ngFileUpload', 'ngImgCrop', 'ui.bootstrap', 'angularUtils.directives.dirPagination']);

/**
 * Custom Filter
 */
evnApp.filter('notInArray', function($filter){
    return function(list, arrayFilter, element){
        if(arrayFilter){
            return $filter("filter")(list, function(listItem){
                return arrayFilter.indexOf(listItem[element]) == -1;
            });
        }
    };
});

/**
 * Root Controller
 */
evnApp.controller('RootCtrl', function RootCtrl($scope, $http) {
    /**
     * Initializations
     */
    $scope.destinations = [];
    $scope.events = [];
    $scope.categories = [];

    var priorityData = new Array();
    priorityData[0] = {value: 0, text: 'Ultra', cssClass: 'btn btn-danger'};
    priorityData[1] = {value: 1, text: 'High', cssClass: 'btn btn-warning'};
    priorityData[2] = {value: 2, text: 'Medium', cssClass: 'btn btn-success'};
    priorityData[3] = {value: 3, text: 'Low', cssClass: 'btn btn-primary'};
    $scope.priorityData = priorityData;

    var costData = new Array();
    costData[0] = {value: 0, text: 'Free'};
    costData[1] = {value: 1, text: '$'};
    costData[2] = {value: 2, text: '$$'};
    costData[3] = {value: 3, text: '$$$'};
    costData[4] = {value: 3, text: '$$$$'};
    $scope.costData = costData;

    $scope.minRatio = "1:1";
    $scope.maxImageWidth = 1024;
    $scope.imagePlaceholder = 'https://eventsnanaimo.com/img/placeholder.png';

    /**
     * Root Functions
     */
    /**
     * Returns an empty detail
     * @returns {*}
     */
    $scope.buildEmptyDetail = function () {
        var emptyDetail = {
            id: '',
            name: '',
            shortDesc: '',
            longDesc: '',
            imageURL: '',
            thumbURL: '',
            phone: '',
            website: '',
            cost: 0,
            email: '',
            activities: [],
        };
        return emptyDetail;
    };

    /**
     * Returns an empty address
     * @returns {*}
     */
    $scope.buildEmptyAddress= function () {
        var emptyAddress = {
            id: '',
            lineOne: '',
            lineTwo: '',
            postalCode: '',
            city: ''
        };
        return emptyAddress;
    };

    /**
     * Returns an empty event
     * @param $eventPriority
     * @returns {*}
     */
    $scope.buildEmptyEvent = function () {
        var emptyDetail = $scope.buildEmptyDetail();
        var emptyEvent = {
            id: '',
            detail: emptyDetail,
            unixStartTime: Math.floor(Date.now() / 1000),
            readableStartTime: '',
            unixEndTime: Math.floor(Date.now() / 1000),
            readableEndTime: '',
            priority: 3,
            destinations: []
        };
        return emptyEvent;
    };

    /**
     * Returns an empty event
     * @param $eventPriority
     * @returns {*}
     */
    $scope.buildEmptyDestination = function () {
        var emptyDetail = $scope.buildEmptyDetail();
        var emptyAddress = $scope.buildEmptyAddress();
        var emptyDestination = {
            id: '',
            detail: emptyDetail,
            address: emptyAddress,
            longitude: '',
            latitude: '',
        };
        return emptyDestination;
    };

    /**
     * Returns an empty Activity
     */
    $scope.buildEmptyActivity = function () {
        var emptyActivity = {
            id: -1,
            name: '',
            category: '',
        };
        return emptyActivity;
    };

    /**
     * Returns the css class for the event priority
     * @param $eventPriority
     * @returns {*}
     */
    $scope.getPriorityClass = function ($eventPriority) {
        if ($scope.priorityData.length > $eventPriority && $eventPriority >= 0) {
            return $scope.priorityData[$eventPriority].cssClass;
        }
        return '';
    };

    /**
     * Returns the css class for the event priority
     * @param $eventPriority
     * @returns {*}
     */
    $scope.getPriorityName = function ($eventPriority) {
        if ($scope.priorityData.length > $eventPriority && $eventPriority >= 0) {
            return $scope.priorityData[$eventPriority].text;
        }
        return '';
    };

    /**
     * Returns the cost as readable test
     * @param $eventPriority
     * @returns {*}
     */
    $scope.getCostName = function (cost) {
        if ($scope.costData.length > cost && cost >= 0) {
            return $scope.costData[cost].text;
        }
        return '';
    };

    /**
     * Returns the destination name given the destination id
     * @param $id
     * @returns {string}
     */
    $scope.getDestinationName = function (id) {
        for (var i = 0; i < $scope.destinations.length; i++) {
            if ($scope.destinations[i].id == id) {
                return $scope.destinations[i].detail.name;
            }
        }
        return 'Unknown Destination (' + id + ')';
    };

    /**
     * Uploads the image file for the given detail id
     * @returns {string}
     */
    $scope.uploadImagesToServer =
            function (id, image, imageType) {
        var formData = new FormData();
        console.log('Uploading Image to Server...');
        console.log(image);
        formData.append('detailId', id);
        formData.append('imageType', imageType);
        formData.append('image', image);
        $http.post('/adminApi/updateImage', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function (response) {
            // REturns the detail ID
            // now post to /adminApi/updateImage
            console.log(response);
        });
    };

    /**
     * Converts Base64 Data to a Blob
     * @param dataURI
     * @returns {*}
     */
    $scope.dataURItoBlob = function (dataURI) {

        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    };

    /**
     * Get's the Address Component
     * @param addressComponents
     * @param componentType
     * @returns {*}
     */
    $scope.getAddressComponent = function (addressComponents, componentType) {
        for (var i = 0; i < addressComponents.length; i++) {
            var component = addressComponents[i];
            for (var j = 0; j < component['types'].length; j++) {
                if (component['types'][j]==componentType) {
                    return component.long_name;
                }
            }
        }
    };

    /**
     * HTTP calls
     */
    /**
     * Returns the list of events
     */
    $scope.getEvents = function (sorton, sortdir) {
        $http.get('/adminApi/getEvents',
            {params: {'sorton': sorton, 'sortdir': sortdir}})
            .then(function (response) {
                $scope.events = response.data.data;
            });
    };

    /**
     * Sets the list of destinations
     */
    $scope.getDestinations = function (sorton, sortdir) {
        $http.get('/adminApi/getDestinations',
            {params: {'sorton': sorton, 'sortdir': sortdir}})
            .then(function (response) {
                $scope.destinations = response.data.data;
            });
    };

    /**
     * Gets the category / activity data
     */
    $scope.getCategoryData = function () {
        $http.get('/adminApi/getCategoryData')
            .then(function (response) {
                $scope.categories = response.data.data;
            });
    };

    $scope.getEvents('priority', 'ASC');
    $scope.getDestinations('name', 'ASC');
    $scope.getCategoryData();
});
