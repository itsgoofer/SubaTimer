const { createApp } = Vue
var fs = require('fs')
const homedir = require('os').homedir()

function writeTimerToFile(timer) {
	fs.writeFile(`${homedir}/Desktop/OBS_TIMER.txt`, timer, (err) => {
		if (err) throw err
	})
}
createApp({
	data() {
		return {
			timer: '01:00:00:00',
			duration: null,
			cycle: null,
			interval: 1000,
			bitsValue: 0.8,
			subsValue: 5,
			donationValue: 1,

			bitsToAdd: 0,
			subsToAdd: 0,
			donationsToAdd: 0,
			isRunning: false,
			showingNotice: false,
			notice: '',
			noticeTimeout: null
		}
	},
	mounted() {},
	methods: {
		startTimer() {

			this.isRunning = true
			this.fixTimerInputFormat()
			this.duration = moment.duration(this.timer, 'milliseconds')
			this.timer = this.formatTimer(this.duration.days(), this.duration.hours(), this.duration.minutes(), this.duration.seconds())

			this.cycle = setInterval(() => {
				this.duration = moment.duration(this.duration - this.interval, 'milliseconds')
				this.timer = this.formatTimer(this.duration.days(), this.duration.hours(), this.duration.minutes(), this.duration.seconds())


				writeTimerToFile(this.timer)
			}, this.interval)
		},

		stopTimer() {
			clearInterval(this.cycle)
			this.isRunning = false
		},

		subsReceived(mode) {
			var amount = this.subsToAdd * this.subsValue
			if (mode == 'add') {
				this.subsToAdd = 0
				this.showNotice('Added ' + amount + ' minutes to the timer!')
				this.duration = moment.duration(this.duration - this.interval, 'milliseconds').add(amount, 'minutes')
			} else {
				this.showNotice('Removed ' + amount + ' minutes from the timer!')
				this.subsToAdd = 0
				this.duration = moment.duration(this.duration - this.interval, 'milliseconds').subtract(amount, 'minutes')
			}
		},

		bitsReceived(mode) {
			var amount = this.bitsToAdd * this.bitsValue
			if (mode == 'add') {
				this.bitsToAdd = 0
				this.showNotice('Added ' + amount.toFixed(2) + ' seconds to the timer! (' + (amount / 60).toFixed(2) + ' minutes)')
				this.duration = moment.duration(this.duration - this.interval, 'milliseconds').add(amount, 'seconds')
			} else {
				this.bitsToAdd = 0
				this.showNotice('Removed ' + amount.toFixed(2) + ' seconds to the timer! (' + (amount / 60).toFixed(2) + ' minutes)')
				this.duration = moment.duration(this.duration - this.interval, 'milliseconds').subtract(amount, 'seconds')
			}
		},

		bucksReceived(mode) {
			var amount = this.donationsToAdd * this.donationValue
			if (mode == 'add') {
				this.donationsToAdd = 0
				this.showNotice('Added ' + amount + ' minutes to the timer!')
				this.duration = moment.duration(this.duration - this.interval, 'milliseconds').add(amount, 'minutes')
			} else {
				this.showNotice('Removed ' + amount + ' minutes from the timer!')
				this.donationsToAdd = 0
				this.duration = moment.duration(this.duration - this.interval, 'milliseconds').subtract(amount, 'minutes')
			}
		},

		showNotice(message) {
			this.notice = message
			this.showingNotice = true

			clearTimeout(this.noticeTimeout)

			this.noticeTimeout = setTimeout(() => {
				this.showingNotice = false
			}, 2000)
		},

		fixTimerInputFormat() {
			let ot = this.timer
			let ota = ot.split(':')
			
			this.timer = `${ota[0]}.${ota[1]}:${ota[2]}:${ota[3]}`
		},

		formatTimer(d, h, m, s) {
			if( d < 10) {
				d = '0' + d
			}
			if (h < 10) {
				h = '0' + h
			}
			if (m < 10) {
				m = '0' + m
			}
			if (s < 10) {
				s = '0' + s
			}
			return `${d}:${h}:${m}:${s}`
		}
	}
}).mount('#app')
