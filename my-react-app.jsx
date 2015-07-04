var Tasks = new Mongo.Collection("tasks");

var List = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
  	return {
  		tasks: Tasks.find().fetch()
  	};
  },

  render() {
  	return (
  		<ul>
  			{this.data.tasks.map(function(task) {
  			return <li key={task._id}>{task.content}</li>
  		})}
  		</ul>
  		);
  }
});

var NewTaskForm = React.createClass({
	onSubmit(event) {
		event.preventDefault();

		var taskContent = React.findDOMNode(this.refs.content).value;

		Meteor.call("insertTask", {
			content:taskContent
		});

		React.findDOMNode(this.refs.content).value = "";
	},
	render() {
		return (
			<form onSubmit={this.onSubmit}>
				<input type="text" ref="content" placeholder="Add a Task" />
			</form>
			);
	}
});

var App = React.createClass({
	render() {
		return(
			<div>
				<List />
				<NewTaskForm />
			</div>
			);
	}
});

Meteor.methods({
	insertTask: function (task) {
		
		// Validate the data

		check(task, {
			content: String
		});

		// Insert Into MongoDB and Minimongo
		Tasks.insert(task);
	}
});


if (Meteor.isClient) {
  Meteor.startup(function () {
    React.render(<App />, document.getElementById('root'));
  });
}