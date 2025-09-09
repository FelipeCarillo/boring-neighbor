class ConstructionController:
    def __init__(self, service):
        self.service = service

    def create_construction(self, data):
        return self.service.create_construction(data)

    def get_construction(self, construction_id):
        return self.service.get_construction(construction_id)

    def update_construction(self, construction_id, data):
        return self.service.update_construction(construction_id, data)

    def delete_construction(self, construction_id):
        return self.service.delete_construction(construction_id)

    def list_constructions(self, filters=None):
        return self.service.list_constructions(filters)
