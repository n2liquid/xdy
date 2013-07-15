'use strict';

function mixin (target, object, property)
{
	var mixin_node;

	if (target.__proto__.__mixin_node)
	{
		mixin_node = get_node(target);
	}
	else
	{
		mixin_node = make_node(target);
	}

	if (object[property] === undefined)
	{
		throw new ReferenceError('Property "' + property + '" is undefined.');
	}

	if (typeof object[property] === 'function')
	{
		mixin_node[property] = object[property].bind(object);
	}
	else
	{
		Object.defineProperty
		(
			mixin_node, property,
			{
				get: function () { return object[property]; },
				set: function (value) { return object[property] = value; }
			}
		);
	}
}

function make_node (object)
{
	remove_node(object);

	var mixin_node = { __mixin_node: true };

	mixin_node.__proto__ = object.__proto__;
	object.__proto__ = mixin_node;

	return mixin_node;
}

function get_node (object)
{
	if (!object.__proto__.__mixin_node)
	{
		return null;
	}

	return object.__proto__;
}

function remove_node (object)
{
	if (object.__proto__.__mixin_node)
	{
		object.__proto__ = object.__proto__.__proto__;
	}
}

module.exports =
{
	mixin: mixin,
	make_node: make_node,
	get_node: get_node,
	remove_node: remove_node
};
