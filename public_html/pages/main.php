<html lang="en" ng-app="evnApp">
<head>
<title>Events Nanaimo Manager</title>
<?php
require __PAGES__ . 'inc/HeaderRequirements.php';
?>
<script src="/javascript/main.js"></script>
</head>
<body>

<div class="col-md-10 col-md-offset-1">
    <ul class="nav nav-pills nav-justified">
        <li class="active"><a href="#" class="h3">Events Nanaimo Manager</a></li>
    </ul><br>
    <ul class="nav nav-tabs">
        <li class="active"><a href="#events-panel" data-toggle="tab" class="h3" >Events</a></li>
        <li><a href="#destination-panel" data-toggle="tab" class="h3" >Destinations</a></li>
    </ul>

    <div class="tab-content">

        <!-- The Event Table -->
        <div id="events-panel" class="tab-pane fade in active" ng-controller="EvntTblCtrl">
            <div class="panel panel-default">
                <table class="table table-bordered">
                    <tr>
                        <th>Priority <i class="btn pull-right glyphicon glyphicon-sort"></i></th>
                        <th>Start Time<i class="btn pull-right glyphicon glyphicon-sort"></i></th>
                        <th>Name <i class="btn pull-right glyphicon glyphicon-sort-by-alphabet"></i></th>
                        <th>Short Description <i class="btn pull-right glyphicon glyphicon-sort-by-alphabet"></i></th>
                        <th>&nbsp;</th>
                    </tr>

                    <tr ng-repeat="event in events">
                        <td><a class="btn" style="width:100%;height:100%;" ng-class="
                           {'btn-danger': (event.priority==1),
                            'btn-warning': (event.priority==2),
                            'btn-success': (event.priority==3),
                            'btn-primary': (event.priority==4)}"" href>{{event.readablePriority}}</a></td>
                        <td>{{event.readableStartTime}}</td>
                        <td>{{event.detail.name}}</td>
                        <td class='hideOverflow'>{{event.detail.shortDesc}}</td>
                        <td>
                            <a href="#edit-event-panel" data-toggle="tab" ng-click="editEvent(event);">
                                <i class="btn pull-left glyphicon glyphicon-pencil"></i>
                            </a>
                            <i class="btn pull-left glyphicon glyphicon-trash"></i>
                        </td>
                    </tr>

                </table>
            </div>
        </div>

        <!-- The Edit Event Form -->
        <div id="edit-event-panel" class="tab-pane fade" ng-controller="EditEvntCtrl">
            <br>
            <div class="panel panel-default col-md-6 col-md-offset-3">
            <h3>Edit Event</h3>
                <form>
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" id="name" ng-model='event.detail.name'>
                    </div>
                    <div class="form-group">
                        <label for="shortDesc">Short Description</label>
                        <textarea class="form-control" rows='2' id="shortDesc" ng-model='event.detail.shortDesc'>
                    </div>
                    <div class="form-group">
                        <label for="longDesc">Long Description</label>
                        <textarea class="form-control" rows='5' id="longDesc" ng-model='event.detail.longDesc'>
                    </div>
                </form>
                <br>
            <a class="btn btn-success" data-toggle="tab" href="#events-panel">
                <span class="glyphicon glyphicon-cloud-upload"></span> Save</a>
            &nbsp;
            <a class="btn btn-danger" data-toggle="tab" href="#events-panel">
                <span class="glyphicon glyphicon-remove"></span> Cancel</a>
            </div>
        </div>

        <div id="destination-panel" class="tab-pane fade">
            <h3>Destinations</h3>
            <p>Some content in menu 1.</p>
        </div>
    </div>
</div>
</body>
</html>