---
layout: post
title: "React Timer"
tags:
  - "react"
  - "moment"
  - "feathers"
---

I made a timer in react with `useEffect`, `setInterval` and using [feathersjs](https://feathersjs.com/) for the backend. Here I'll show the main pieces and then how they all fit together.

## Timer

`useEffect` creates an Interval when the timer has been started.

```js
useEffect(() => {
	let interval = null;
	if (timerStart) {
		interval = setInterval(() => {
			// set the state for current time
		}, 1000);
	} else if (!timerStart) {
		clearInterval(interval);
	}
	return () => clearInterval(interval);
});
```

## Start and Stop functions

The `timerStart` needs to be persistent so that the timer is not reset when the browser is refreshed. In this case, a `feathers` service is called to save the start time and total elapsed time to a database. `window.localStorage` could also work, but only if the application was intended to be used in a single browser runtime. I wanted the timer to be synced across devices so it could be started and stopped from anywhere. Therefore, a server and database was required.

```js
const handleStartTaskTimer = (obj) => {
	// update the task with the new start time
	client.service("tasks").update(obj._id, {
		...obj,
		timerStart: new Date(),
	});
};
```

When the `stop` button is clicked a new time entry is pushed to the timeLog and the timer is cleared.

```js
const handleStopTaskTimer = (obj) => {
	setDiff(0);
	const newTimeLog = obj.timeLog;
	newTimeLog.push([obj.timerStart, new Date()]);
	client.service("tasks").update(obj._id, {
		...obj,
		timeLog: newTimeLog,
		timerStart: undefined,
	});
};
```

## Time logic

I used `moment` to compare the `timerStart` with the current time. The primary benefit of this dependency is to make use of the `moment-duration-format` plugin. This plugin made the display of elapsed time much easier (and less buggy) than if I did it myself. Maybe I'll write a formatting library in the future :)

```js
// get the difference in time between now and when the timer started
const diff = moment().diff(timerStart) / 1000;
// get the duration as measured in seconds and then format
const duration = moment
	.duration(diff, "seconds")
	.format("hh:mm:ss", { trim: false });
```

## Full component

```js
import React, { useEffect, useState } from "react";
import moment from "moment";
import momentDuration from "moment-duration-format";
import client from "./feathers";

momentDuration(moment);

function Timer({ task }) {
	const { timerStart } = task;
	const [diff, setDiff] = useState(0);

	useEffect(() => {
		let interval = null;
		if (timerStart) {
			interval = setInterval(() => {
				setDiff(moment().diff(timerStart) / 1000);
			}, 1000);
		} else if (!timerStart) {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	});

	const handleStartTaskTimer = (obj) => {
		client.service("tasks").update(obj._id, {
			...obj,
			timerStart: new Date(),
		});
	};

	const handleStopTaskTimer = (obj) => {
		setDiff(0);
		const newTimeLog = obj.timeLog;
		newTimeLog.push([obj.timerStart, new Date()]);
		client.service("tasks").update(obj._id, {
			...obj,
			timeLog: newTimeLog,
			timerStart: undefined,
		});
	};

	const duration = moment
		.duration(diff, "seconds")
		.format("hh:mm:ss", { trim: false });

	return (
		<div className="timer">
			<div className={`time ${timerStart ? "active" : ""}`}>
				{timerStart ? duration : "00:00:00"}
			</div>
			<button
				type="button"
				disabled={timerStart}
				onClick={() => {
					handleStartTaskTimer(task);
				}}
			>
				🔴 Start
			</button>
			<button
				disabled={!timerStart}
				type="button"
				onClick={() => {
					handleStopTaskTimer(task);
				}}
			>
				⬛ Stop
			</button>
		</div>
	);
}

export default Timer;
```
