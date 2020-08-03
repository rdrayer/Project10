import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component {

    state = {
        course: '',
        author: [],
        authenticatedUser: [],
    };

    componentDidMount() {
       const { context } = this.props;
       context.data.getCourse(this.props.match.params.id)
       .then(course => {
           if(course) {
               this.setState({
                   course,
                   author: course.User,
                   authenticatedUser: context.authenticatedUser
               });
           }
       })
       .catch( err => {
           this.props.history.push("/error");
       })
    }

    authButtons = () => {
        const courseId = this.props.match.params.id;
        const { authenticatedUser, author } = this.state;
        if (authenticatedUser) {
            if(author.id === authenticatedUser.id) {
                return(
                    <span>
                        <Link className="button" to={`/courses/${courseId}/update`}>Update Course</Link>
                    </span>
                )
            }
        }
    }

    deleteCourse = () => {
        const { context } = this.props;
        const { authenticatedUser } = this.state;
        const emailAddress = authenticatedUser.emailAddress;
        const password = authenticatedUser.password;
        const userId = authenticatedUser.id;
        const id = this.props.match.params.id;

        context.data.deleteCourse(id, emailAddress, password)
        .then(errors => {
            if(errors.length) {
                this.setState({ errors });
            } else {
                this.props.history.push("/courses");
            }
        })
        .catch((err) => {
            this.props.history.push("/error");
        })
    }

    render() {
        const { course, author, } = this.state;

        return(
            <div>
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100">
                            {this.authButtons()}
                            <Link className="button" to="/">Delete Course</Link>
                            <Link className="button button-secondary" to="/">Return to List</Link>
                        </div>
                    </div>
                </div>
                <div className="bounds course--detail">
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{course.title}</h3>
                            <p>By {author.firstName + " " + author.lastName}</p>
                        </div>
                        <div className="course--description">
                            <ReactMarkdown>{course.description}</ReactMarkdown>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>{course.estimatedTime}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <ul>
                                        <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
       
}

