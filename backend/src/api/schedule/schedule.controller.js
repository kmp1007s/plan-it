const Joi = require("joi");
const Schedule = require("models/schedule");
const Timer = require("lib/timer");

/**
 * 스케쥴 리스트 가져오기
 */
exports.list = async ctx => {
  const { user } = ctx.request;

  if (!user) {
    console.log("No Decoded User");
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

  console.log("schedule length: ", schedules.length);
  if (schedules.length) {
    await Timer.clearAllTimers();
    for (let schedule of schedules) {
      const triggerTime = schedule.startTime.split(":");
      Timer.pushTimer(
        triggerTime[0],
        triggerTime[1],
        user.subscription,
        schedule.schedule
      );
    }
    console.log("Register Timer Length: ", Timer.timerIdsLength());
  } else console.log("No Schedule");
};

/**
 * 스케쥴을 DB에 새로 저장
 */
exports.create = async ctx => {
  console.log("create Schedule");
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

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) return ctx.throw(400, error);

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

  console.log("schedule length: ", schedules.length);
  if (schedules.length) {
    await Timer.clearAllTimers();
    for (let schedule of schedules) {
      const triggerTime = schedule.startTime.split(":");
      Timer.pushTimer(
        triggerTime[0],
        triggerTime[1],
        user.subscription,
        schedule.schedule
      );
    }
    console.log("Register Timer Length: ", Timer.timerIdsLength());
  } else console.log("No Schedule");
};
