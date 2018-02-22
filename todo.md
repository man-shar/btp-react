**TODO**
EVERYTHING IS BROKEN. codemirror doesn't render marks, layer loop gets one more shape than it should. wtf.

* unmount codemirror mark when component updates.

* initialise rectangle's x and y as reference attribtues:
---* x = index from shape's index and a function of width of the bar
---* y = chart height - height of the rect

* Add DragLayer component for showing component while dragging.
* clear out the own Attributes from the deleted layers and shapes though.

* just display columns in data. remove rows. 
* heirarchy in side bar.
* initialise chart width and height as referred attributes of x, y axis domain. add domains as attributes in the axes.

* check for cyclic reference in reference attributes.
* colorbrewer palletes
* also check if an attribute expression change is in a layer whose attribute depends on data. if so, change it for all child shapes.
* add padding in chart width/height. make them as reference attributes of padding.