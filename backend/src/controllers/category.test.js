const request = require('supertest');
const faker = require('faker');
const app = require('../../index');

describe('Category Endpoints', () => {
	let parentCreatedId = null,
		childCreatedId = null;

	it('GET - All Categories - Run 1', async () => {
		await request(app)
			.get('/v1/categories')
			.expect(200)
			.expect(res => {
				res.body.forEach(item =>
					expect(item).toMatchObject({
						id: expect.any(Number),
						name: expect.any(String),
						parentId: expect.toBeOneOf([expect.any(Number), null]),
						children: expect.any(Array)
					})
				);
			});
	});

	it('POST - Create New Category - Root', async () => {
		await request(app)
			.post('/v1/categories')
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: faker.commerce.department()
			})
			.expect(202)
			.expect(res => {
				expect(res.body).toMatchObject({
					id: expect.any(Number),
					name: expect.any(String)
				});
				parentCreatedId = res.body.id;
			});
	});

	it('POST - Create New Category - Child', async () => {
		await request(app)
			.post('/v1/categories')
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: faker.commerce.department(),
				parentId: 9
			})
			.expect(202)
			.expect(res => {
				expect(res.body).toMatchObject({
					id: expect.any(Number),
					name: expect.any(String)
				});
				childCreatedId = res.body.id;
			});
	});

	it('POST - Create New Category - Child', async () => {
		await request(app)
			.post('/v1/categories')
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: faker.commerce.department(),
				parentId: 10
			})
			.expect(202)
			.expect(res => {
				expect(res.body).toMatchObject({
					id: expect.any(Number),
					name: expect.any(String),
					parentId: expect.any(Number)
				});
			});
	});

	it('POST - Create New Category - Invalid Parent', async () => {
		await request(app)
			.post('/v1/categories')
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: 'Shoes',
				parentId: 199
			})
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					message: expect.any(String)
				});
			});
	});

	it('POST - Create New Category - Duplicate with Same Name (Parent)', async () => {
		await request(app)
			.post('/v1/categories')
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: 'Women',
				parentId: null
			})
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					message: expect.any(String)
				});
			});
	});

	it('POST - Create New Category - Duplicate with Same Name (Child)', async () => {
		await request(app)
			.post('/v1/categories')
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: 'Women',
				parentId: 1
			})
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					message: expect.any(String)
				});
			});
	});

	it('PUT - Update Category - Valid Parent ID', async () => {
		await request(app)
			.put(`/v1/categories/${childCreatedId}`)
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				parentId: 8
			})
			.expect(200)
			.expect(res => {
				expect(res.body).toMatchObject({
					id: expect.any(Number),
					name: expect.any(String),
					parentId: expect.toBeOneOf([expect.any(Number), null])
				});
			});
	});

	it('PUT - Update Category - Valid Name', async () => {
		await request(app)
			.put(`/v1/categories/${childCreatedId}`)
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: faker.commerce.department() + ' 2'
			})
			.expect(200)
			.expect(res => {
				expect(res.body).toMatchObject({
					id: expect.any(Number),
					name: expect.any(String),
					parentId: expect.toBeOneOf([expect.any(Number), null]),
					message: expect.any(String)
				});
			});
	});

	it('PUT - Update Category - Invalid Parent', async () => {
		await request(app)
			.put(`/v1/categories/${childCreatedId}`)
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: 'Shoes',
				parentId: 199
			})
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					message: expect.any(String)
				});
			});
	});

	it('PUT - Update Category - Invalid String ID', async () => {
		await request(app)
			.put(`/v1/categories/gaa`)
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: 'Shoes',
				parentId: 199
			})
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					message: expect.any(String)
				});
			});
	});

	it('PUT - Update Category - Invalid Integer ID', async () => {
		await request(app)
			.put(`/v1/categories/${childCreatedId}1`)
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: 'Shoes',
				parentId: 199
			})
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					message: expect.any(String)
				});
			});
	});

	it('PUT - Update Category - Duplicate with Same Name', async () => {
		await request(app)
			.put(`/v1/categories/3`)
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: 'Clothing',
				parentId: 1
			})
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					message: expect.any(String)
				});
			});
	});

	it('PUT - Update Category - Move Parent to Inner Child', async () => {
		await request(app)
			.put(`/v1/categories/10`)
			.set({
				'Content-Type': 'application/json'
			})
			.send({
				name: 'Men',
				parentId: 9
			})
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					message: expect.any(String)
				});
			});
	});

	it('DELETE - Delete Category - Invalid Integer ID', async () => {
		await request(app)
			.delete(`/v1/categories/${childCreatedId}1`)
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					message: expect.any(String)
				});
			});
	});

	it('DELETE - Delete Category - Invalid String ID', async () => {
		await request(app)
			.delete(`/v1/categories/gaa`)
			.expect(400)
			.expect(res => {
				expect(res.body).toMatchObject({
					message: expect.any(String)
				});
			});
	});

	it('DELETE - Delete Category', async () => {
		await request(app)
			.delete(`/v1/categories/${childCreatedId}`)
			.expect(200)
			.expect(res => {
				expect(res.body).toMatchObject({
					id: expect.any(Number),
					message: expect.any(String)
				});
			});
	});

	it('GET - All Categories - Run 2', async () => {
		await request(app)
			.get('/v1/categories')
			.expect(200)
			.expect(res => {
				res.body.forEach(item =>
					expect(item).toMatchObject({
						id: expect.any(Number),
						name: expect.any(String),
						parentId: expect.toBeOneOf([expect.any(Number), null]),
						children: expect.any(Array)
					})
				);
			});
	});
});
