/**
 * Created by David on 2017-03-25.
 */
var evnApp = angular.module('evnApp', ['ngResource','ui.bootstrap']);

/**
 * Global Vars
 */
var priorityData = new Array();
priorityData[0] = {value:0, text:'Ultra', cssClass:'btn btn-danger'}
priorityData[1] = {value:1, text:'High', cssClass:'btn btn-warning'}
priorityData[2] = {value:2, text:'Medium', cssClass:'btn btn-success'}
priorityData[3] = {value:3, text:'Low', cssClass:'btn btn-primary'}
evnApp.constant('priorityData', priorityData);

/**
 * Global Functions
 */
evnApp.run(function($rootScope) {
    $rootScope.getPriorityClass = function ($eventPriority) {
        if (priorityData.length > $eventPriority && $eventPriority >= 0) {
            return priorityData[$eventPriority].cssClass;
        }
        return '';
    }
});

/**
 * Event Table Controller
 */
evnApp.controller('EvntTblCtrl', function EvntTblCtrl($scope, $http, $rootScope) {
    $scope.events = [];

    $http.get('/adminApi/getEvents')
        .then(function(response) {
            $scope.events = response.data.data;
    });

    $scope.editEvent = function(event) {
        $rootScope.$broadcast('eventSelect', event);
    };
});

/**
 * Edit Event Controller
 */
evnApp.controller('EditEvntCtrl', function EvntEvntCtrl(
        $scope, $http, $rootScope, $filter, priorityData) {
    /**
     * Calendar Picker
     */
    /**
     * Click event to open the start date calendar popup
     */
    $scope.openStartCal = function() {
        $scope.state.startCalOpen = true;
    };

    /**
     * Called when the Start Date has changed
     */
    $scope.startDateChange = function() {
        $scope.event.unixStartTime = new Date($scope.startDate).getTime()/1000;
    };

    /**
     * Called when the Start Time has changed
     */
    $scope.startTimeChange = function() {
        $scope.event.unixStartTime = new Date($scope.startDate).getTime()/1000;
    };

    $scope.state = {
        startCalOpen: false
    };

    $scope.priorityData = priorityData;
    $scope.priorityCssClass = 'btn btn-primary';

    $scope.$on('eventSelect', function(event, selectedEvent) {
        $scope.event = selectedEvent;
        $scope.startDate = selectedEvent.unixStartTime * 1000;
        $scope.priorityCssClass = $rootScope.getPriorityClass(selectedEvent.priority);
    });

    $scope.updateClass = function() {
        $scope.priorityCssClass = $rootScope.getPriorityClass($scope.event.priority);
    };
});