
// To remove entities global search
$(function () {
  if (!firmDirectory.configuration.standalone) {
    var $header = $("#header");
    $header.find(".to-replace").entitysearch("destroy");
    $header.find("#search").show();
  }
});

// To override entities global search filters
$(function () {
    entities.globalSearch.options.popover.ajax.data = function(keyword, config) {
      var request = {
        searchType: config.type,
        filters: [entities.api.search.filterBuilder.profile("", keyword, entities.api.search.filterBuilder.operator.like),entities.api.search.filterBuilder.profile("RecordType", "People", entities.api.search.filterBuilder.operator.equal)],
        include: { skills: false, entities: [], facets: [] },
        sorting: { propertyName: entities.search.profile.formatProperty(entities.profile.properties.system.lastName), direction: entities.api.search.sortDirection.asc },
        paging: { size: config.max, number: 1 }
      };
      if (config.type !== 'account') {
          var prop = (entities.cache.get(entities.cache.keys.definitions)[config.type] || { properties: [] }).properties[0].name;
          request.sorting.propertyName = [config.type, prop].join(".");
      }
      return request;
    };
});

// To change globalSearch user click to go to profile instead of feed
updateGlobalSearchResultsData = function (data, searchText) {
    if (data == null || searchText != $('#global-search-text').val().trim()) {
        $("#global-search-results").empty();
        $("#global-search-results").css("display", "none");
    }
    else {
        for (var i = 0; i < data.all.length; i++) {
            var result = data.all[i];

            if (result.type == 'user') {
                result.friendlyType = 'Person';
		            result.url = makeServicesUrlRelative(result.url + "/viewprofile");
            }
            else if (result.type == 'system') {
                result.friendlyType = 'System';
                result.url = makeServicesUrlRelative(result.url + "/activities");
            }
            else if (result.type == 'tag') {
                result.friendlyType = 'Tag';
                result.isTag = true;
                result.url = makeServicesUrlRelative(result.url + "/activities");
            }
            else {
                result.friendlyType = 'Group';
                result.url = makeServicesUrlRelative(result.url + "/activities");
            }
        }

        data.searchText = searchText;
        data.encodedSearchText = encodeURIComponent(searchText);

        if (pulse.ui.currentStream != null) {
            data.currentStream = pulse.ui.currentStream;
            data.currentStream.isUser = data.currentStream.type == 'user';
            data.currentStream.isGroup = data.currentStream.type == 'group';
            data.currentStream.isSystem = data.currentStream.type == 'system';
            data.currentStream.isTag = data.currentStream.type == 'tag';
            data.currentStream.isFolder = data.currentStream.type == 'filefolder';
        }

        dynamicContentReady($("#global-search-results").html(Mustache.to_html($('#tmplGlobalSearchResults').html(), data)));
        $("#global-search-results").find('li:first').addClass('selected');
        $("#global-search-results").css("display", "block");
    }
}

// To redirect People tab in default search to Entities People Search
$(function () {
  pex.addEventHandler({
    event: pex.event.any.page.loaded,
    handler: function (e) {
      if (e.url.startsWith("search/all")) {
        var $person = $("#search-types li[data-value='person'] > a");
        $person.attr("onclick", "").click(function() {
          var querystring = pex.url.querystring();
          var phrase = pex.url.deparam(querystring).p || "";
          var options = { keyword: phrase };
          entities.search.route.go([], options);
        });
      }
    }
  });
});
