import { Injectable } from "@nestjs/common";

@Injectable()
export class FormatHalService {
    formatHal(data: any, parametersHal: any): any {
        if (data instanceof Array && data.length > 0) {
            return {
                ...parametersHal,
                _embedded: {
                    order: data.map((item) => {
                        return {
                            ...item,
                            _links: {
                                self: { href: `${parametersHal.self.href}/${item.id}` },
                                edit: {
                                    href: `${parametersHal.self.href}/${item.id}`,
                                    method: 'PUT'
                                },
                                delete: {
                                    href: `${parametersHal.self.href}/${item.id}`,
                                    method: 'DELETE'
                                }
                            }
                        }
                    })
                }
            }
        } else if (data) {
            return {
                ...parametersHal,
                _embedded: {
                    ...data,
                    _links: {
                        self: { href: `${parametersHal.self.href}/${data.id}` },
                        edit: {
                            href: `${parametersHal.self.href}/${data.id}`,
                            method: 'PUT'
                        },
                        delete: {
                            href: `${parametersHal.self.href}/${data.id}`,
                            method: 'DELETE'
                        }
                    }
                }
            }
        }
        return null;
    }
}