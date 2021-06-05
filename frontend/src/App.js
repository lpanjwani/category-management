/* Depedencies */
import React from 'react';
import { useQuery } from 'react-query';
import { Container, Nav, Navbar } from 'react-bootstrap';

/* CSS Imports */
import 'bootstrap/dist/css/bootstrap.min.css';

/* Custom Components */
import Tree from './components/Tree';

/* Categories Component */
export default function Categories() {
	// Fetch Categories
	const { isLoading, data, isError, error } = useQuery('categories', () =>
		fetch('http://localhost:3001/v1/categories').then(res => res.json())
	);

	// Check if Loading & Render Loading Text
	if (isLoading) return 'Loading...';

	// Check if Error & Render Error Message
	if (isError) {
		return <span>Error: {error.message}</span>;
	}

	return (
		<Container>
			<Navbar bg="light" expand="lg">
				<Navbar.Brand>Styli</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse>
					{data.map((item, key) => (
						<Nav className="mr-auto">
							<Tree key={item.id} data={item} />
						</Nav>
					))}
				</Navbar.Collapse>
			</Navbar>
		</Container>
	);
}
