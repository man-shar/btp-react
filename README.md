My BTP, trying to do it in React and Redux. VanillaJS became too much data to manage and update stuff.


TODO:

so now the edited attribute is added to own attributes but the prob is. the div rerenders and fucking jumps. And the CodeMirror cursor also jumps after every fucking change for some reason. I'll have to make a default listing style for the shapes. and render opacity based on whether the list is in own or inherited attributes. fuck man.

  * clear out the own Attributes from the deleted layers and shapes though.
  * handle editing of an inherited attribute. transfer it to an own attribute and prevent rerender because I guess that is going to be a problem. editing can be done from a name or an expression string.
  * handle codemirror marks man.
  * should we begin anchors/snapping first or set up charting first?