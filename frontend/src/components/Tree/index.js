import React, { memo } from 'react';
import { NavDropdown } from 'react-bootstrap';

/* Functonal Tree Element */
const Tree = memo(({ data }) => {
	// Check for Parent
	const isParent = data.children && data.children.length > 0;

	// Render Conditionally
	return isParent ? (
		<NavDropdown title={data?.name}>
			{data.children.map(item => (
				<Tree key={item.id} data={item} />
			))}
		</NavDropdown>
	) : (
		<NavDropdown.Item>{data?.name}</NavDropdown.Item>
	);
});

export default Tree;
