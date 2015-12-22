
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
