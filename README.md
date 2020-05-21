## Overview

This app shows how to integrate [SignalFx Microservices APM (µAPM)](https://www.splunk.com/en_us/software/microservices-apm.html) and [Catchpoint](https://www.catchpoint.com/) systems.

 * It generates traces on the backend side using SignalFx auto instrumentation [library](https://github.com/signalfx/signalfx-nodejs-tracing).
 * Then it pushes SignalFx µAPM trace ID as a part of Real User Metrics (RUM) data to the Catchpoint platform.

The server side auto instrumentation happens in the [server.js](server.js) file.

The client side RUM metrics reporting (including SignalFx µAPM trace ID) is configured in the [index.ejs](views/index.ejs) file. 

## Quick Start

1. To report traces to SignalFx µAPM platform you need to [install SignalFx Smart Agent](https://docs.signalfx.com/en/latest/apm/apm-getting-started/apm-smart-agent.html) on a host that runs this app.

1. This app uses [OpenWeather](https://openweathermap.org/) API to get temperature in a given city. Before running the app you need to [obtain the API key](https://openweathermap.org/appid) and set it as an environment variable called `OWM_KEY`.

1. To start the app using your API key you can use the following command (please note the syntax may be a bit different depending on the operation system and shell used):
   ```
   $ OWM_KEY=your-owm-key-123 node server.js
   ```
1. Now open your browser and visit http://localhost:3000

