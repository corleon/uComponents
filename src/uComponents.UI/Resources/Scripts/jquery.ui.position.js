﻿/*
* jQuery UI Position @VERSION
*
* Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* TODO: create document page for position and add link here
*/
(function ($) {

    var horizontalPositions = /left|center|right/,
	horizontalDefault = 'center',
	verticalPositions = /top|center|bottom/,
	verticalDefault = 'center',
	_position = $.fn.position;

    $.fn.position = function (options) {
        if (!options || !options.of) {
            return _position.apply(this, arguments);
        }

        options = $.extend({
            stackFix: true
        }, options);

        var target = $(options.of),
		collision = (options.collision || 'flip').split(' '),
		offset = options.offset ? options.offset.split(' ') : [0, 0],
		targetWidth,
		targetHeight,
		basePosition;

        if (options.of == document) {
            targetWidth = target.width();
            targetHeight = target.height();
            basePosition = { top: 0, left: 0 };
        } else if (options.of == window) {
            targetWidth = target.width();
            targetHeight = target.height();
            basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
        } else if (options.of.preventDefault) {
            targetWidth = targetHeight = 0;
            basePosition = { top: options.of.pageY, left: options.of.pageX };
        } else {
            targetWidth = target.outerWidth();
            targetHeight = target.outerHeight();
            basePosition = target.offset();
        }

        // force my and at to have valid horizontal and veritcal positions
        // if a value is missing or invalid, it will be converted to center 
        $.each(['my', 'at'], function () {
            var pos = options[this].split(' ');
            pos = pos.length == 1
			? horizontalPositions.test(pos[0])
				? pos.concat([verticalDefault])
				: verticalPositions.test(pos[0])
					? [horizontalDefault].concat(pos)
					: [horizontalDefault, verticalDefault]
			: pos;
            pos[0] = horizontalPositions.test(pos[0]) ? pos[0] : horizontalDefault;
            pos[1] = verticalPositions.test(pos[1]) ? pos[1] : verticalDefault;

            options[this] = pos;
        });

        // normalize collision option
        if (collision.length == 1) {
            collision[1] = collision[0];
        }

        // normalize offset option
        offset[0] = parseInt(offset[0], 10) || 0;
        if (offset.length == 1) {
            offset[1] = offset[0];
        }
        offset[1] = parseInt(offset[1], 10) || 0;

        switch (options.at[0]) {
            case 'right':
                basePosition.left += targetWidth;
                break;
            case horizontalDefault:
                basePosition.left += targetWidth / 2;
                break;
        }

        switch (options.at[1]) {
            case 'bottom':
                basePosition.top += targetHeight;
                break;
            case verticalDefault:
                basePosition.top += targetHeight / 2;
                break;
        }

        basePosition.left += offset[0];
        basePosition.top += offset[1];

        return this.each(function () {
            var elem = $(this),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			position = $.extend({}, basePosition),
			over,
			myOffset,
			atOffset;

            switch (options.my[0]) {
                case 'right':
                    position.left -= elemWidth;
                    break;
                case horizontalDefault:
                    position.left -= elemWidth / 2;
                    break;
            }

            switch (options.my[1]) {
                case 'bottom':
                    position.top -= elemHeight;
                    break;
                case verticalDefault:
                    position.top -= elemHeight / 2;
                    break;
            }

            $.each(['left', 'top'], function (i, dir) {
                ($.ui.position[collision[i]] &&
				$.ui.position[collision[i]][dir](position, {
				    targetWidth: targetWidth,
				    targetHeight: targetHeight,
				    elemWidth: elemWidth,
				    elemHeight: elemHeight,
				    offset: offset,
				    my: options.my,
				    at: options.at
				}));
            });

            (options.stackfix && $.fn.stackfix && elem.stackfix());
            // the by function is passed the offset values, not the position values
            // we'll need the logic from the .offset() setter to be accessible for
            // us to calculate the position values to make the by option more useful
            ($.isFunction(options.by) ? options.by.call(this, position) : elem.offset(position));
        });
    };

    $.ui.position = {
        fit: {
            left: function (position, data) {
                var over = position.left + data.elemWidth - $(window).width() - $(window).scrollLeft();
                position.left = over > 0 ? position.left - over : Math.max(0, position.left);
            },
            top: function (position, data) {
                var over = position.top + data.elemHeight - $(window).height() - $(window).scrollTop();
                position.top = over > 0 ? position.top - over : Math.max(0, position.top);
            }
        },

        flip: {
            left: function (position, data) {
                var over = position.left + data.elemWidth - $(window).width() - $(window).scrollLeft(),
				myOffset = data.my[0] == 'left' ? -data.elemWidth : data.elemWidth,
				offset = -2 * data.offset[0];
                position.left += position.left < 0 ? myOffset + data.targetWidth + offset : over > 0 ? myOffset - data.targetWidth + offset : 0;
            },
            top: function (position, data) {
                var over = position.top + data.elemHeight - $(window).height() - $(window).scrollTop(),
				myOffset = data.my[1] == 'top' ? -data.elemHeight : data.elemHeight,
				atOffset = data.at[1] == 'top' ? data.targetHeight : -data.targetHeight,
				offset = -2 * data.offset[1];
                position.top += position.top < 0 ? myOffset + data.targetHeight + offset : over > 0 ? myOffset + atOffset + offset : 0;
            }
        }
    };


    // the following functionality is planned for jQuery 1.4
    // copied from http://plugins.jquery.com/files/offset.js.txt
    $.fn.extend({

        /**
        * Stores the original version of offset(), so that we don't lose it
        */
        _offset: $.fn.offset,

        /**
        * Set or get the specific left and top position of the matched
        * elements, relative the the browser window by calling setXY
        * @param {Object} newOffset
        */
        offset: function (newOffset) {
            return !newOffset ? this._offset() : this.each(function () {
                var el = this;

                var hide = false;

                if ($(el).css('display') == 'none') {
                    hide = true;
                    $(el).show();
                };

                var style_pos = $(el).css('position');

                // default to relative
                if (style_pos == 'static') {
                    $(el).css('position', 'relative');
                    style_pos = 'relative';
                };

                var offset = $(el).offset();

                if (offset) {
                    var delta = {
                        left: parseInt($(el).css('left'), 10),
                        top: parseInt($(el).css('top'), 10)
                    };

                    // in case of 'auto'
                    if (isNaN(delta.left))
                        delta.left = (style_pos == 'relative') ? 0 : el.offsetLeft;
                    if (isNaN(delta.top))
                        delta.top = (style_pos == 'relative') ? 0 : el.offsetTop;

                    if (newOffset.left || newOffset.left === 0)
                        $(el).css('left', newOffset.left - offset.left + delta.left + 'px');

                    if (newOffset.top || newOffset.top === 0)
                        $(el).css('top', newOffset.top - offset.top + delta.top + 'px');
                };
                if (hide) $(el).hide();
            });
        }

    });

})(jQuery);