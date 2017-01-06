(function($) {
	$.fn.treeviewOpenNode = function() {
		var CLASSES = $(this).treeview.classes;
		$(this)
			.parent().find(">.hitarea")
				.replaceClass(CLASSES.expandableHitarea, CLASSES.collapsableHitarea)
				.replaceClass(CLASSES.lastExpandableHitarea, CLASSES.lastCollapsableHitarea)
			.end()
				.replaceClass(CLASSES.expandable, CLASSES.collapsable)
				.replaceClass(CLASSES.lastExpandable, CLASSES.lastCollapsable)
			.end()
			.parent().find(">ul").show();
	};
	$.fn.treeviewCloseNode = function() {
		var CLASSES = $(this).treeview.classes;
		$(this)
			.parent().find(">.hitarea")
				.replaceClass(CLASSES.collapsableHitarea, CLASSES.expandableHitarea)
				.replaceClass(CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea)
			.end()
				.replaceClass(CLASSES.collapsable, CLASSES.expandable)
				.replaceClass(CLASSES.lastCollapsable, CLASSES.lastExpandable)
			.end()
			.parent().find(">ul").hide();
	}
})(jQuery)