class ConstructionService:
    def __init__(self, construction_repository):
        self.construction_repository = construction_repository

    def create_construction(self, construction_data):
        # Business logic for creating a construction
        return self.construction_repository.create(construction_data)

    def get_construction(self, construction_id):
        # Business logic for retrieving a construction
        return self.construction_repository.get_by_id(construction_id)

    def update_construction(self, construction_id, update_data):
        # Business logic for updating a construction
        return self.construction_repository.update(construction_id, update_data)

    def delete_construction(self, construction_id):
        # Business logic for deleting a construction
        return self.construction_repository.delete(construction_id)

    def list_constructions(self, filters=None):
        # Business logic for listing constructions with optional filters
        return self.construction_repository.list(filters)
