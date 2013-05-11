// js lazy eval
// sort of a lazy eval in js. 
// you can write js code that is easy to change to another language
// this is not how I would implement it if writing a lang from scratch.
// i would just implement a lazy calling strategy


var __slice = [].slice

var f6 = function (/*fn, args*/) {
	var args, fn;
	fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	//todo currying so you can keep going	
	//pretend polymorphic
	// caching
	// binding and iffs?

	var ret;
	if (!args.length) {
		ret = function (newValue) {
			if (arguments.length) {
				var oldValue = ret._value	
				ret._value = newValue
				//trigger
				_.each(ret.listeners, function (listener) {
					listener(newValue, oldValue, ret);
				})
				return ret
			} else {
				return ret._value
			}
		}
		ret._value = fn
		ret.listeners = []
		ret.listen = function (fn) {
			ret.listeners.push(fn)	
		}
		//test this
		ret.push = function (x) {
			ret._value.push(x)	
			_.each(ret.listeners, function (listener) {
				listener(newValue, oldValue, x, ret);
			})
		}
	} else {
		ret = function () {
			var len = ret.fn.length
			var neededArgs = ret.args.slice(0, len) 
			var leftOver = ret.args.slice(len) 
			var returnValue = ret.fn.apply(null, neededArgs)
			if (leftOver.length) {
				returnValue = f6.apply(null,[returnValue].concat(leftOver)).value()	
			}
			return returnValue;
			//todo: cache this sometime
		}
		if (_.isFunction(fn)) {
			ret.fn = fn
			ret.args = args
		} else {
			ret.fn = args[0]
			ret.args = [fn].concat(args.slice(1))
		}

		ret.input = f6()
		// prevent too much binding?
		f6.actuallyDoTheBinding(ret.input, ret, ret)
		ret.listen = function (fn) {
			ret.input.listeners.push(fn)	
		}
	}
	ret.isf6ed = true;
	if (args.length) {
		ret.isFn = true;
		ret.value = ret;
	} else {
		ret.isFn = false;
		ret.value = ret;
	}
	return ret;
}


f6.add = function (a, b) {
	return f6.value(a) + f6.value(b)
}

f6.lessThan = function (a, b) {
	return f6.value(a) < f6.value(b)
}

f6.isf6ed = function (a) {
	return _.isObject(a) && a.isf6ed
}

f6.value = function (a) {
	if (f6.isf6ed(a)) {
		return a.value()
	} else {
		return a	
	}
}

f6.if6 = function (a, b, c) {
	if (f6.value(a)) {
		return f6.value(b)
	} else {
		return f6.value(c)
	}
} 

f6.actuallyDoTheBinding = function (input, outerExp, innerExp) {
	//todo: don't bind all, just the ones you know you use. think of an if statement
	_.each(innerExp.args, function (arg) {
		if (f6.isf6ed(arg)) {
			if (!arg.isFn) {
				arg.listen(function (newValue, oldValue, argInput) {
					var inputValue = f6.value(outerExp)
					input(inputValue) //should I wrap it? 	
				})
			} else {
				f6.actuallyDoTheBinding(input, outerExp, arg);
			}
		}
	})				
}

f6.concat = function (a, b) {
	return f6.value(a).toString() + f6.value(b).toString()
}

f6.substr = function (str, start, len) {
	return f6.value(str).substr(f6.value(start), f6.value(len))
}
