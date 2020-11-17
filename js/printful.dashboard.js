/**
 * Imported in Dashboard, not sure how much of this is actually necessary.
 */

var timeout;
$(document).ready(function () {

    $('[data-toggle="tooltip-delay"]').tooltip({
        html: true,
        delay: {hide: 1500},
        container: 'body'
    });

    if ($('#filter').is(':visible')) {
        var position = $('#filter').offset().top;
        var isFixed = false;

        $(window).on('scroll resize', function () {
            var isMobile = window.innerWidth < 768;
            // Because the offset could have changed after previously initialized
            if (!isFixed) {
                position = $('#filter').offset().top;
            }

            var headerHeight = window.innerWidth < 768 ? $('.dashboard > .header').outerHeight() : $('.dashboard__header').outerHeight();

            if ($(document.body).hasClass('embedded')) {
                headerHeight = 0;
            }

            var contentWidth = $('#content .dashboard__container').outerWidth()
            var fullWidth = $('#content .dashboard__content').width() + 32;
            var offsets = (fullWidth - contentWidth) / 2;
            if (typeof $('#filter').attr('data-scroll-expand-target') !== 'undefined') {
                fullWidth = $($('#filter').attr('data-scroll-expand-target')).width() + 30;
                offsets = 0;
            }
            if ($(this).scrollTop() + headerHeight >= position) {
                $('#filter').parent().css({
                    marginTop: $('#filter').outerHeight()
                });
                $('#filter').css({
                    borderBottom: '1px solid #eeeeee',
                    width: isMobile? fullWidth - 32 : fullWidth,
                    position: 'fixed',
                    top: headerHeight,
                    marginLeft: isMobile ? '' : -offsets - 16 + 'px',
                    marginRight: isMobile ? '' : -offsets - 16 + 'px',
                    paddingLeft: isMobile ? '' : offsets + 'px',
                    paddingRight: isMobile ? '' : offsets + 'px',
                    zIndex: 99,
                });
                isFixed = true;
            } else {
                $('#filter').removeAttr('style').parent().removeAttr('style');
                isFixed = false;
            }
        });

        $(document).on('change', '#filter select', function () {
            PF.filterData();
        });

        $(document).on('keyup', '#filter input[type="text"]', function () {
            if (timeout !== null) {
                window.clearTimeout(timeout);
            }
            timeout = window.setTimeout(function () {
                PF.filterData();
            }, 1000);
        });
    }

    $(document).on('click', 'a[data-target]', function (e) {
        e.preventDefault();

        var $size = $(this).attr('data-target');
        $size = $size.replace('.bs-modal', '').replace('-', '');
        $size = $size.length ? $size : null;
        var $url = $(this).attr('href');

        PF.Dialog.open({size: $size, url: $url});
    });

    $(document).on('click', 'tr[data-target]', function (e) {
        if (e.target.nodeName == 'A') {
            return (e.target.onclick !== null) ? false : true;
        }

        e.preventDefault();

        var $size = $(this).attr('data-target');
        $size = $size.replace('.bs-modal', '').replace('-', '');
        $size = $size.length ? $size : null;
        var $url = $(this).attr('data-url') + '?id=' + $(this).attr('data-id');

        PF.Dialog.open({size: $size, url: $url});
    });

    $('.menu-item[data-target]').on('click', function (e) {
        e.preventDefault();

        var $size = $(this).attr('data-target');
        $size = $size.replace('.bs-modal', '').replace('-', '');
        $size = $size.length ? $size : null;
        var $url = $(this).attr('data-url') + '?screenmode=' + $(this).attr('data-screenmode');

        PF.Dialog.open({
            size: $size,
            url: $url,
            animation: 'fade zoom'
        });
    });


    $(document).on('click', '#status a[data-action="close"]', function () {
        var expire = new Date();
        expire.setDate(expire.getDate() + 30);
        var value = escape(false) + "; expires=" + expire.toUTCString();
        document.cookie = 'orderSample=' + value;
        document.location.reload();
    });

    $(document).on('click', '.field-store a[data-trigger="filefield"]', function () {
        $(this).parent().find('input:file').trigger('click');
    });

    $(document).on('change', '.field-store input:file', function () {
        var fileName = $(this).val().substr(12, $(this).val().length),
            title = $(this).data('title'),
            uploadButton = $(this).siblings('.upload-button'),
            uploadError = $(this).siblings('.file-error'),
            submitButton = $(this).siblings('input[type="submit"]');

        $(this).parent().find('a[data-trigger="filefield"]').html(fileName || title);

        if ($(this).get(0).files.length) {
            var fileSize = $(this).get(0).files[0].size;

            if (uploadButton.hasClass('hidden')) {
                uploadButton.removeClass('hidden');
            }

            if (fileSize > 200000000) {
                uploadError.html(dlang("dashboard", "File size can't be more then 200 MB"));
                submitButton.attr('disabled', 'disabled');

                if (!uploadButton.hasClass('hidden')) {
                    uploadButton.addClass('hidden');
                }
            }
            else {
                uploadError.html('');
                submitButton.attr('disabled', false);
            }

        }
        else {
            uploadError.html('');
            submitButton.attr('disabled', false);

            if (!uploadButton.hasClass('hidden')) {
                uploadButton.addClass('hidden');
            }
        }
    });

    $(document).on('click', 'a[data-file]', function (e) {
        e.preventDefault();
        $('input#' + $(this).attr('data-file')).trigger('click');
    });

    $(document).on('click', '#delete-me', function () {
        if (confirm(dlang('dashboard', 'Are you sure you want to delete your account?'))) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    action: 'delete-me'
                },
                success: function (r) {
                    window.location.href = r.url;
                }
            });
        }
    });

    $(document).on('mouseenter mouseleave', '.order-popup__view-content', function (e) {
        var targetPopover = $('#' + $(this).data('target-popover'));

        if (e.type === 'mouseenter') {
            targetPopover.css({
                top: $(e.target).position().top + 30,
                left: $(e.target).position().left
            }).show();
        } else {
            targetPopover.hide();
        }
    });

    $(document).on('click', 'a[data-toggle="invite"]', function () {
        $(this).hide();
        $('#invite').removeClass('hidden');
    });

    $(document).on('click', '#older-notifications', function () {

        var elem = $(this),
            page = elem.data('page'),
            category = elem.data('category'),
            last_id = $('.notification-list .notification-item').last().data('id'),
            last_date = $('.notification-list .notification-item').last().data('date');

        elem.html(dlang('dashboard', 'Please wait ...'));

        $.ajax({
            url: '/dashboard/notifications/load',
            type: 'post',
            dataType: 'json',
            data: {
                page: page,
                last_id: last_id,
                last_date: last_date,
                category: category
            },
            success: function (obj) {
                if (typeof obj !== 'undefined' && obj !== null) {
                    elem.data('page', obj.page);
                    $('div.notifications.notification-list').append(obj.notifications);

                    if (!obj.loadMore) {
                        elem.remove();
                    }
                    else {
                        elem.html(dlang('dashboard', 'Load older notifications'));
                    }
                }
            }
        });

    });

    $(document).on('shown.bs.modal', function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="tooltip-html"]').tooltip({html: true, delay: {show: 100, hide: 2000}});

        var $baseIndex = 1040;
        $('.modal-backdrop').each(function () {
            $(this).css('zIndex', $baseIndex);
            $baseIndex += 10;
        });

        $baseIndex = 1050;
        $('.modal').each(function () {
            $(this).css('zIndex', $baseIndex);
            $baseIndex += 10;
        });
    });

    $('[data-toggle="popover"]').popover();
    $('body').on('click', function (e) {
        $('[data-toggle="popover"]')
            .not('.popover-trigger-manual') // exception not to hide popovers created from elements with class 'popover-trigger-manual'
            .each(function (a) {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });
});

var PF = PF || (window ? window.PF : {}) || {};

PF.handleForms = function () {
    $('#container form .control-group input').on('focus', function () {
        $(this).parent().find('span.help-inline').empty();
    });

    $('form .control-group input').on('focus', function () {
        $(this).parent().find('span.help-inline').empty();
    });

    $('form .control-group span.help-inline').on('click', function () {
        $(this).empty();
        var $parent = $(this).parent();
        $parent.find('input').focus();
        $parent.find('select').focus();
    });

};

PF.handleTables = function () {
    $(window).on('resize', function () {
        $('.tableRow').each(function () {
            var $tr = $(this).parent().find('table.table tbody tr:eq(0)');
            if ($tr.length) {
                $(this).css('top', $tr.position().top);
            }
        });
    });
    $(window).trigger('resize');

    $(document).on('click', 'table#orders thead th', function () {
        $('table#orders thead th').removeClass('active');
        $(this).addClass('active');
    });

    $('table.table tbody tr').on('mouseenter mouseleave', function (e) {
        var $tr = $(this);
        var $hover = $tr.parent().parent().parent().parent().find('.tableRowHover');

        if ($hover.length && !$tr.hasClass('no-hover')) {
            if (e.type === 'mouseenter') {
                if (e.currentTarget.className === 'error') {
                    $hover.addClass('error');
                }
                $hover.css({top: $tr.position().top, height: $tr.height()}).show();
            }
            else {
                $hover.removeClass('error');
                $hover.css({top: 0, height: 0}).hide();
            }
        }
    });
};

PF.defaultReturnAddress = function () {
    var address = $('textarea#store-address');
    if (address.is(':visible') && address.val() === "") {
        address.val(dclang('dashboard', 'Default return address', '19749 Dearborn St,\nCA 91311,\nUSA'));
    }
};

PF.loadMask = function (bool) {
    if (bool !== false) {
        $('#overlay').fadeIn('fast', function () {
            $('#loading').css({
                top: ($(window).height() - 100) / 2,
                left: ($(window).width() - 100) / 2
            }).fadeIn('fast');
        });
    }
    else {
        $('#overlay, #loading').fadeOut('fast', function () {
            $('#loading').css('display', 'none');
        });
    }
};

PF.disableOnSubmit = function (el) {
    if (typeof el !== 'undefined' && el !== null) {
        $(el).attr('disabled', 'disabled');
        PF.loadMask(true);
    }
};

/**
 * Execute result filter call using parameters from HTML form
 * @param options
 */
PF.filterData = function (options) {

    var $options = options || {};
    var $params = {};

    if ($options.page) {
        $params.page = $options.page;
    }

    $options.child = 'table#dataview';
    var $filter = $('#filter').last();

    if (typeof $filter.attr('data-child') !== 'undefined') {
        $options.child = '#' + $filter.attr('data-child');
    }

    if ($options.child.indexOf('table') > -1) {
        $($options.child).find('tbody')
            .html('<tr class="no-hover"><td colspan="' + $('table#dataview thead th').length + '" align="center"><h1 class="align">' + lang('Loading...') + '<br />' + lang('please wait') + '</h1></td></tr>');
    }

    $filter.find('div[data-column]').each(function () {
        var $el = $(this);

        if ($el.attr('data-column')) {
            var $field = $el.find('input');
            if (!$field.length) {
                $field = $el.find('select');
            }
            if ($field.val().length) {
                $params[$el.attr('data-column')] = $field.val();
            }
        }
    });

    if ($options.child.indexOf('table') > 0) {
        $($options.child).find('thead th').each(function () {
            var $el = $(this);
            if ($el.hasClass('active')) {
                $params.sortCol = $el.attr('data-column');
                $params.sortDir = ($el.attr('class') == 'active sorting_desc' ? 'desc' : 'asc');
            }
        });
    }

    var target = $filter.attr('data-target');

    $.getJSON(target, $params, function (obj) {
        if (typeof obj !== 'undefined' && obj !== null) {
            if ($options.child.indexOf('table') > -1) {
                $($options.child).find('tbody').html(obj.data.table);
            } else {
                $($options.child).html(obj.data.table);
            }

            if (obj.data.filters) {
                $.each(obj.data.filters, function (key, value) {
                    if (PF.OrderFilters.hasTabs) {
                        PF.OrderFilters.updateTab(key, value);
                    } else {
                        $('#order-filters a[data-filter="' + key + '"] span.order-count')
                            .text('(' + value + ')');
                    }
                });
                // Call render once
                if (PF.OrderFilters.hasTabs) {
                    PF.OrderFilters.reRenderTabs();
                }
            }

            $('[data-toggle="tooltip"]').tooltip({html: true});
            $('[data-toggle="popover"]').popover();

            var getPaging = function(targetNode) {
                mkE.clearNode(targetNode);

                var par = new PF.Components.Paging.Par;
                par.page = obj.page;
                par.pages = obj.pages;
                par.callback = function(page) {
                    page = parseInt(page);
                    PF.filterData({ page: page });

                };

                return new PF.Components.Paging(par);
            };

            var pagingTopNode = document.getElementById('js--custom-pagination-top');
            getPaging(pagingTopNode).append(pagingTopNode);

            var pagingBotNode = $('div.custom-pagination')[0];
            getPaging(pagingBotNode).append(pagingBotNode)
        }
    });
};

PF.checkSync = function (store, callback) {
    var fn = function () {
        $.getJSON('/dashboard/sync/check?store=' + store, function (data) {
            if (data == 1) {
                window.setTimeout(fn, 2000);
            } else {
                callback();
            }
        });
    };
    window.setTimeout(fn, 2000);
};

PF.CountrySelector = {
    countries: null,
    states: null,
    statesVisible: false,
    init: function (countryDropdown, stateDropdown) {
        var countries = this.countries = $(countryDropdown);
        var states = this.states = $(stateDropdown);
        var init = function () {
            PF.CountrySelector.statesVisible = states.find('option').size() > 1;
            states.parents('.form-group').toggle(PF.CountrySelector.statesVisible);
        };
        countries.on('change init-states-rel', function (event, defState) {
            countries.parents('.form-group').removeClass('has-error').find('.help-block').text('');
            $.post('/geo/states?country=' + $(this).val(), function (data) {
                if (typeof data !== 'undefined' && data !== null) {
                    states.html(data);
                    if (typeof defState === 'string' && defState.length > 0) {
                        states.val(defState);
                    }
                    states.trigger('chosen:updated');
                }
                init();
            });
        });
        states.on('change', function () {
            states.parents('.form-group').removeClass('has-error').find('.help-block').text('');
        });

        states.chosen({width: '100%'});
        countries.chosen({width: '100%'});
        init();
    },
    validate: function () {
        var valid = true;
        var formGroup = this.countries.parents('.form-group');
        if (this.countries.val() == '') {
            valid = false;
            formGroup.addClass('has-error').find('.help-block').text(dlang('dashboard', 'Country can not be blank.'));
        } else {
            formGroup.removeClass('has-error').find('.help-block').text('');
        }
        formGroup = this.states.parents('.form-group');
        if (this.statesVisible && this.states.val() == '') {
            valid = false;
            formGroup.addClass('has-error').find('.help-block').text(dlang('dashboard', 'State can not be blank.'));
        } else {
            formGroup.removeClass('has-error').find('.help-block').text('');
        }
        return valid;
    }
};

PF.FormOverlay = {
    form: null,
    overlay: null,
    show: function () {
        var overlay = this.overlay = $('<div>', {
            'class': 'formOverlay',
            html: [
                $('<div>', {
                    'class': 'waiting',
                    html: [
                        $('<img>', {src: '/static/images/layout/spinner-white.gif'}),
                        $('<h1>', {html: dlang('dashboard', 'Please wait...')})
                    ]
                }),
            ]
        });
        $('body').append(overlay);
    },
    hide: function () {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }
};