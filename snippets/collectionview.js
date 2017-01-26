var dynamicItemHeightEnabled = false;

var dynamicItemHeightButton = new tabris.Button({
  bottom: 16, right: 16, left: 16,
  font: 'bold 14px',
  text: 'Dynamic height disabled'
}).on('select', () => {
  dynamicItemHeightEnabled = !dynamicItemHeightEnabled;
  collectionView.estimatedItemHeight = dynamicItemHeightEnabled ? 256 : 0;
  dynamicItemHeightButton.text = 'Dynamic height ' + (dynamicItemHeightEnabled ? 'enabled' : 'disabled');
}).appendTo(tabris.ui.contentView);

var columnCountTextView = new tabris.TextView({
  bottom: [dynamicItemHeightButton, 16], right: 16, width: 32,
  font: 'bold 14px',
  text: 3
}).appendTo(tabris.ui.contentView);

var slider = new tabris.Slider({
  left: 16, bottom: [dynamicItemHeightButton, 16], right: [columnCountTextView, 16], height: 48,
  minimum: 1,
  maximum: 8,
  selection: 3
}).on('change:selection', function({value: selection}) {
  collectionView.columnCount = selection;
  columnCountTextView.text = selection;
}).appendTo(tabris.ui.contentView);

var IMAGE_PATH = 'images/';

var notes = [];
var notesChunk = [
  ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '#613466'],
  ['Donec ultricies purus id porta fringilla. Pellentesque tempus dignissim lacinia. Maecenas lacinia vulputate urna, a interdum massa aliquam eu.', '#e37ba5'],
  ['Vestibulum luctus libero vitae convallis convallis.', '#4fceec'],
  ['Aenean lacinia augue faucibus, sagittis nisl sit amet, condimentum justo. Mauris pulvinar diam non porta aliquam.', '#9d9897'],
  ['Aenean congue nulla non neque aliquam varius nec non urna. Duis cursus ultrices urna, eget suscipit nulla mollis eget. Morbi nec nibh at purus porta ornare.', '#c9afee'],
  ['Aliquam elementum viverra odio vitae pellentesque. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur vitae rhoncus velit.', '#8bb811'],
  ['Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.', '#27d9d9'],
  ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '#d20c04'],
  ['Donec ultricies purus id porta fringilla. Pellentesque tempus dignissim lacinia. Maecenas lacinia vulputate urna, a interdum massa aliquam eu.', '#f0ebb6'],
  ['Vestibulum luctus libero vitae convallis convallis.', '#fc5973'],
  ['Aenean lacinia augue faucibus, sagittis nisl sit amet, condimentum justo. Mauris pulvinar diam non porta aliquam.', '#461b7d'],
  ['Aenean congue nulla non neque aliquam varius nec non urna. Duis cursus ultrices urna, eget suscipit nulla mollis eget. Morbi nec nibh at purus porta ornare.', '#fa6c6b'],
  ['Aliquam elementum viverra odio vitae pellentesque. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur vitae rhoncus velit.', '#233f44'],
  ['Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.', '#aa7364'],
  ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '#4fa527'],
  ['Donec ultricies purus id porta fringilla. Pellentesque tempus dignissim lacinia. Maecenas lacinia vulputate urna, a interdum massa aliquam eu.', '#de2c36'],
  ['Vestibulum luctus libero vitae convallis convallis.', '#0dc080'],
  ['Aenean lacinia augue faucibus, sagittis nisl sit amet, condimentum justo. Mauris pulvinar diam non porta aliquam.', '#9fbf5e'],
  ['Aenean congue nulla non neque aliquam varius nec non urna. Duis cursus ultrices urna, eget suscipit nulla mollis eget. Morbi nec nibh at purus porta ornare.', '#01c7bf'],
  ['Aliquam elementum viverra odio vitae pellentesque. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur vitae rhoncus velit.', '#5ce191'],
  ['Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.', '#f8a23'],
  ['Lorem ipsum dolor sit amet.', '#2591cb']
].map(function(element) {
  return {note: element[0], color: element[1]};
});

for (var i = 0; i < 10; i++) {
	notes = notes.concat(notesChunk);
}

var collectionView = new tabris.CollectionView({
  left: 0, top: 0, right: 0, bottom: slider,
  items: notes,
  columnCount: 3,
  itemHeight: 256,
  // estimatedItemHeight: 256,
  initializeCell: function(cell) {
    var noteTextView = new tabris.TextView({type:'multiline', layoutData: {top: 0, left: 0, bottom: 0, right: 0}}).appendTo(cell);
    cell.on('change:item', function({value: note}) {
      noteTextView.set('text', note.note);
      cell.background = note.color;
    });
  }
}).on('select', function(target, value) {
  console.log('selected', value.firstName);
}).appendTo(tabris.ui.contentView);
