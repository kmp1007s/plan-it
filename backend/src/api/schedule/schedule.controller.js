const Joi = require("joi");
const Schedule = require("models/schedule");
const Validate = require("lib/validate");
const Timer = require("lib/timer");

exports.list = async ctx => {
  const { user } = ctx.request;

  if (!user) {
    ctx.status = 403;
    return;
  }

  let schedules = null;
  try {
    schedules = await Schedule.findByUserId(user.userId);
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = schedules;

  if (schedules.length) {
    Timer.clearAllTimers();
    for (let schedule of schedules) {
      console.log(schedule);

      const triggerTime = schedule.startTime.split(":");
      Timer.pushTimer(
        triggerTime[0],
        triggerTime[1],
        user.subscription,
        schedule.schedule
      );
    }
  } else console.log("No Schedule");
};

exports.create = async ctx => {
  const { user } = ctx.request;

  if (!user) {
    ctx.status = 403;
    return;
  }

  const schema = Joi.object().keys({
    date: Joi.string().required(),
    startTime: Joi.string().required(),
    finishTime: Joi.string().required(),
    schedule: Joi.string().required()
  });

  const error = Validate.isProperRequest(ctx.request.body, schema);
  if (error) {
    Validate.respondBadRequest(ctx, error);
    return;
  }

  const scheduleInfo = {
    date: ctx.request.body.date,
    startTime: ctx.request.body.startTime,
    finishTime: ctx.request.body.finishTime,
    schedule: ctx.request.body.schedule,
    userId: user.userId
  };

  let schedule = null;
  try {
    schedule = await Schedule.create(scheduleInfo);
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.status = 201;
  ctx.body = schedule;

  let schedules = null;
  try {
    schedules = await Schedule.findByUserId(user.userId);
  } catch (e) {
    return ctx.throw(500, e);
  }

  if (schedules.length) {
    Timer.clearAllTimers();
    for (let schedule of schedules) {
      console.log(schedule);

      const triggerTime = schedule.startTime.split(":");
      Timer.pushTimer(
        triggerTime[0],
        triggerTime[1],
        user.subscription,
        schedule.schedule
      );
    }
  } else console.log("No Schedule");
};
