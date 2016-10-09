# homebridge-gpio-fan

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin `npm install -g homebridge-gpio-fan`
3.	Update your configuration file - see below for an example

## Wiring diagram

## Configuration
* `accessory`: "GPIOFan"
* `name`: descriptive name

Example configuration:

```json
    "accessories": [
        {
            "accessory": "GPIOFan",
            "name": "Desk Fan"
        }
    ]
```

## License

MIT

