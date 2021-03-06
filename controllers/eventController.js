const { NotExtended } = require('http-errors');
var Event = require('../models/event');
var dayjs = require('dayjs');

// Display list of all Events.
exports.event_list = function(req, res, next) {
    Event.find({})
        .exec((err, list_events) => {
            if (err) { return next(err); }
            res.send(list_events)
        })
};

// Display something on Even create GET request
exports.event_create_get = function(req, res) {
    res.send('Creating task and event')
};

// Handle Event create on POST.
exports.event_create_post = function(req, res, next) {
    let title = req.body.title;
    title = (title === "")? "No title" : title;
    let description = req.body.desp;
    let startDate = req.body.datestart;
    let endDate = req.body.dateend;
    let startTime = req.body.timestart;
    let endTime = req.body.timeend;

    let timeZone = req.body.timeZone;

    // Date processing code
    function toIsoTime(date, time, timeZone) {
        let combined = date + "T" + time + ":00" + timeZone;
        let result = dayjs(combined).toISOString();
        return result;
    }

    let isoTimeStart = toIsoTime(startDate, startTime, timeZone);
    let isoTimeEnd = toIsoTime(endDate, endTime, timeZone);
      
    let event = new Event(
        {
            title: title,
            description: description,
            completed: false,
            show: true,
            startTime: isoTimeStart,
            endTime: isoTimeEnd,
            timeZone: timeZone
        }
    )
    event.save()
        .then(() =>  res.redirect("/"))
        .catch(err => {
            console.log(err);
            return next(err);
        })
};

exports.event_update_get = function(req, res, next) {
    res.end('GET: Updating task and event');
    console.log('Updating');
};

exports.event_update_post = function(req, res, next) {
    let toUpdateId = req.params.id;
    let updatedEvent = req.body;
    Event.findByIdAndUpdate(toUpdateId, updatedEvent)
        .then(() => {
            res.redirect("/");
        })
        .catch(err => {
            return next(err);
        })
}

exports.event_delete_get = function(req, res, next) {
    res.send("NOT IMPLEMENTED: Delete event GET")
}

exports.event_delete_post = function(req, res, next) {
    Event.deleteOne({ _id: req.params.id })
        .then(() => res.redirect("/"))
        .catch(err => next(err))
}