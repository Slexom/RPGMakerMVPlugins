//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
// Script: MSX Inventory Categories
// Version: 1.0.0
// Author: Melosx
// Last Update: October 04th, 2016  12:07am
//#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#

var Imported = Imported || {};
Imported.MSX_InventoryCategories = true;

var MSX = MSX || {};
MSX.InventoryCategories = MSX.InventoryCategories || {};

 /*:
 * @plugindesc v1.00 Add new categories to inventory
 * @author Melosx
 *
 * @param Extra Categories
 * @desc This is the order in which the categories will appear. Use
 * a space to separate the each category.
 * @default Consumables Cooking Crafting Misc
 *
 
 * @help
 * #=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
 * Introduction
 * #=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
 * This plugin allow you to add new categories in your inventory.
 * Also provide a notetag to set the correct category for the item.
 *
 * #=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
 * Notetag
 * #=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
 *
 * Item Notetag
 *
 * <Category: X>
 * Where X is the name of the category you want the item.
 * Example:
 * <Category: Cooking>
 *
 * #=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
 * Changelog
 * #=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#=#
 *
 * v1.0 Initial release.
 */

var params = PluginManager.parameters("MSX_InventoryCategories");
MSX.InventoryCategories.Categories = String(params["Extra Categories"]);
 
 
MSX.InventoryCategories.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!MSX.InventoryCategories.DataManager_isDatabaseLoaded.call(this)) return false;
  this.setItemCategory($dataItems);
  return true;
};
 
DataManager.setItemCategory = function(items) {
	for(var n = 1; n < items.length; n++){
		var itm = items[n];
		var notedata = itm.note.split(/[\r\n]+/);
		itm.customCategory = '';
		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(/<(?:Category):[ ](.*)>/i)) {
				itm.customCategory = String(RegExp.$1).toLowerCase();
			} 
		}
	}
};
 
MSX.InventoryCategories.Window_itemList_includes = Window_ItemList.prototype.includes;
Window_ItemList.prototype.includes = function(item) {     
	if (item === null) {
		return false;
	}
	if(!item.customCategory){
		return MSX.InventoryCategories.Window_itemList_includes.call(this, item);
	}else{
		return DataManager.isItem(item) && item.itypeId === 1 && item.customCategory === this._category;
	}	
};

Window_ItemCategory.prototype.makeCommandList = function() {
	this._categories = MSX.InventoryCategories.Categories.split(' ');
	this.addCommand(TextManager.item,    'item');
    this.addCommand(TextManager.weapon,  'weapon');
    this.addCommand(TextManager.armor,   'armor');
    for (var i = 0; i < this._categories.length; ++i) {
		this.addCommand(this._categories[i], this._categories[i].toLowerCase());
    }
    this.addCommand(TextManager.keyItem, 'keyItem');
};
 
 