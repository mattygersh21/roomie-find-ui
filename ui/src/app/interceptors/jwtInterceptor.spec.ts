import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EXCLUDED_URL_SNIPPETS, JwtInterceptor } from './jwtInterceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('JwtInterceptor', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
            ]
        });
        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should add Authorization header if JWT exists and URL is not excluded', () => {
        localStorage.setItem('jwt', 'test-token');
        http.get('/api/data').subscribe();
        const req = httpMock.expectOne('/api/data');
        expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
        req.flush({});
    });

    it('should NOT add Authorization header for any excluded URL snippet', () => {
        localStorage.setItem('jwt', 'test-token');
        EXCLUDED_URL_SNIPPETS.forEach(snippet => {
            http.get(snippet).subscribe();
            let req = httpMock.expectOne(snippet);
            expect(req.request.headers.has('Authorization')).toBeFalse();
            req.flush({});

            http.post(snippet, {}).subscribe();
            req = httpMock.expectOne(snippet);
            expect(req.request.headers.has('Authorization')).toBeFalse();
            req.flush({});
        });
    });

    it('should NOT add Authorization header if JWT does not exist', () => {
        http.get('/api/data').subscribe();
        const req = httpMock.expectOne('/api/data');
        expect(req.request.headers.has('Authorization')).toBeFalse();
        req.flush({});
    });
});