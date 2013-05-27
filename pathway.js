// js lazy eval
// sort of a lazy eval in js. 
// you can write js code that is easy to change to another language
// this is not how I would implement it if writing a lang from scratch.
// i would just implement a lazy calling strategy


var __slice = [].slice

var fr = function (/*fn, args*/) {
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
				ret._value = fr.value(newValue)
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
			var len = ret.fn.length || ret.args.length
			var neededArgs = ret.args.slice(0, len) 
			var leftOver = ret.args.slice(len) 
			var returnValue = ret.fn.apply(null, neededArgs)
			if (leftOver.length) {
				returnValue = fr.apply(null,[returnValue].concat(leftOver)).value()	
			}
			return returnValue;
			//todo: cache this sometime
		}
		if (_.isFunction(fn) && fn.isfred) {
			ret.fn = args[0]	
			ret.args = [fn].concat(args.slice(1))
		} else if (_.isFunction(fn)) {
			ret.fn = fn
			ret.args = args
		} else if (_.isFunction(args[0])){
			ret.fn = args[0]
			ret.args = [fn].concat(args.slice(1))
		} else {
			
		}

		ret.input = fr()
		// prevent too much binding?
		fr.actuallyDoTheBinding(ret.input, ret, ret)
		ret.listen = function (fn) {
			ret.input.listeners.push(fn)	
		}
	}
	ret.isfred = true;
	if (args.length) {
		ret.isFn = true;
		ret.value = ret;
	} else {
		ret.isFn = false;
		ret.value = ret;
	}
	return ret;
}

fr.add = function (a, b) {
	return fr.value(a) + fr.value(b)
}

fr.mod = function (a, b) {
	return fr.value(a) % fr.value(b)
}

fr.equals = function (a, b) {
	return fr.value(a) == fr.value(b)
}

fr.len = function (a) {
	//todo only if its an array. if not just do fr.value(a)("prop-access-length") or something like that
	return fr.value(a).length
}

fr.lessThan = function (a, b) {
	return fr.value(a) < fr.value(b)
}

fr.isfred = function (a) {
	return _.isObject(a) && a.isfred
}

fr.value = function (a) {
	if (fr.isfred(a)) {
		return a.value()
	} else {
		return a	
	}
}

fr.iff = function (a, b, c) {
	if (fr.value(a)) {
		return fr.value(b)
	} else {
		return fr.value(c)
	}
} 

fr.actuallyDoTheBinding = function (input, outerExp, innerExp) {
	//todo: don't bind all, just the ones you know you use. think of an if statement
	_.each(innerExp.args, function (arg) {
		if (fr.isfred(arg)) {
			if (!arg.isFn) {
				arg.listen(function (newValue, oldValue, argInput) {
					var inputValue = fr.value(outerExp)
					input(inputValue) //should I wrap it? 	
				})
			} else {
				fr.actuallyDoTheBinding(input, outerExp, arg);
			}
		}
	})				
}

fr.concat = function (a, b) {
	return fr.value(a).toString() + fr.value(b).toString()
}

fr.substr = function (str, start, len) {
	return fr.value(str).substr(fr.value(start), fr.value(len))
}

fr.valued = function (fn) {
	return function () {
		var args;
		args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];	
		var realArgs = _.map(args, function (arg) { return fr.value(arg)})	
		return fn.apply(null, realArgs)
	}
}


fr.list = function () {
	//TODO: finsith this
	var args;
	args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];	
	return fr.toLinkedList(args)
}

fr.toLinkedList = function (list, index) {
	index = index || 0
	var item = list[index]
	if (is_array(item)) {
		item = to_linked_list(item, 0)
	}

	if (index + 1 >= list.length) {
		return [item];
	} else {
		var next = to_linked_list(list, index + 1)
		if (next.length == 1) { next = next[0] }
		return [item, next] 
	}
}

fr.get = function (list, item){
  return fr.value(list)[fr.value[item]]
}

fr.or = function (a, b) {
  return fr.value(a) || fr.value(b)
}



/* 
 name = (frList name drew age 28)

 name frList name age 28 
 
 */





