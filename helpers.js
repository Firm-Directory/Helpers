
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
    var $header = $("#header");
    $header.find("to-replace").entitysearch("option", "popover", {
      ajax: {
        delay: 0,
        url: entities.api.search.endpoints.account,
        type: "POST",
        data: function (keyword) {
          return $.toJSON({
            searchType: entities.api.search.type.account,
            filters: [entities.api.search.filterBuilder.profile("", keyword, entities.api.search.filterBuilder.operator.like)/* Provide your additional filders here */],
            include: { skills: false, entities: [], facets: [] },
            sorting: { propertyName: entities.search.profile.formatProperty(entities.profile.properties.system.lastName), direction: entities.api.search.sortDirection.asc }
          });
        }
    });
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
