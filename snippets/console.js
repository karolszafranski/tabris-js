import {tabris, Button, TextInput, contentView, TextView} from 'tabris';

const logTextInput = new TextInput({
  left: 10, top: 20, right: 10,
  text: 'Message',
  message: 'Log message'
}).appendTo(contentView);

['debug', 'log', 'info', 'warn', 'error', 'trace'].forEach((method) => {
  new Button({
    left: 10, right: 10, top: 'prev() 10',
    text: method
  }).on('select', () => {
    console[method](logTextInput.text);
  }).appendTo(contentView);
});

contentView.append(new TextView({
  top: 'prev() 24',
  left: 12,
  font: '18px'
}));

tabris.onLog(ev =>
  $(TextView).only().text = ev.level + ': ' + ev.message
);
